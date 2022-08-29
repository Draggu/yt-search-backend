import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'directives/auth/types';
import { CreateHideInput } from 'modules/generic/hides/dto/create-hide.input';
import { HidesService } from 'modules/generic/hides/hides.service';
import { MarkdownMentionService } from 'modules/generic/markdown-mention/markdown-mention.service';
import { CreateOpinionInput } from 'modules/generic/opinion/dto/create-opinion.input';
import { OpinionService } from 'modules/generic/opinion/opinion.service';
import { EntityManager, Repository } from 'typeorm';
import { canSeeHiden } from '../../../helpers/can-see-hidden';
import { CreateArticleInput, UpdateArticleInput } from './dto/article.input';
import { ArticleRevisionEntity } from './entities/article-revision.entity';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>,
        @InjectRepository(ArticleRevisionEntity)
        private readonly articleRevisionRepository: Repository<ArticleRevisionEntity>,
        @InjectEntityManager() private readonly entityManager: EntityManager,
        private readonly markdownMentionService: MarkdownMentionService,
        private readonly opinionService: OpinionService,
        private readonly hidesService: HidesService,
    ) {}

    async comment(
        articleId: string,
        createOpinionInput: CreateOpinionInput,
        currentUser?: CurrentUser,
    ) {
        const article = await this.articleRepository.findOneOrFail({
            where: { id: articleId },
        });

        return this.opinionService.create(
            createOpinionInput,
            article.opinionTarget.id,
            currentUser,
        );
    }

    create(currentUser: CurrentUser, createArticleInput: CreateArticleInput) {
        return this.entityManager.transaction(async (manager) => {
            const article = await manager.save(ArticleEntity, {
                hideTarget: this.hidesService.createTarget(),
                opinionTarget: this.opinionService.createTarget(),
                author: currentUser,
            });

            const revision = await manager.save(ArticleRevisionEntity, {
                ...createArticleInput,
                editedBy: currentUser,
                mentions: await this.markdownMentionService.getMentions(
                    createArticleInput.content,
                ),
                article,
            });

            article.lastRevision = revision;

            await manager.save(ArticleEntity, article);

            return article;
        });
    }

    async toogleHide(
        currentUser: CurrentUser,
        id: string,
        createHideInput: CreateHideInput,
    ) {
        const article = await this.articleRepository.findOneOrFail({
            where: { id },
        });

        return this.hidesService.toogleHide(
            currentUser,
            article.hideTarget.id,
            createHideInput,
        );
    }

    async findOne(id: string, currentUser?: CurrentUser) {
        return this.articleRepository.findOneOrFail({
            where: {
                id,
                hideTarget: canSeeHiden(currentUser)
                    ? undefined
                    : {
                          isHiden: false,
                      },
            },
        });
    }

    async update(
        currentUser: CurrentUser,
        { id, ...updateArticleInput }: UpdateArticleInput,
    ) {
        const newestRevision =
            await this.articleRevisionRepository.findOneOrFail({
                where: {
                    article: {
                        id,
                    },
                },
                relations: {
                    article: true,
                },
                order: {
                    editedAt: 'DESC',
                },
            });
        const { article } = newestRevision;

        return this.entityManager.transaction(async (manager) => {
            const revision = {
                ...newestRevision,
                ...updateArticleInput,
                editedBy: currentUser,
            };

            article.lastRevision = await manager.save(ArticleRevisionEntity, {
                ...revision,
                mentions: await this.markdownMentionService.getMentions(
                    revision.content,
                ),
            });

            return manager.save(ArticleEntity, article);
        });
    }
}
