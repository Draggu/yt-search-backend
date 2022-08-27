import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'directives/auth/types';
import { CreateHideInput } from 'modules/generic/hides/dto/create-hide.input';
import { HideTargetEntity } from 'modules/generic/hides/entities/hide-target.entity';
import { HidesService } from 'modules/generic/hides/hides.service';
import { MarkdownMentionService } from 'modules/generic/markdown-mention/markdown-mention.service';
import { CreateOpinionInput } from 'modules/generic/opinion/dto/create-opinion.input';
import { OpinionTargetEntity } from 'modules/generic/opinion/entities/opinion-target.entity';
import { OpinionService } from 'modules/generic/opinion/opinion.service';
import { EntityManager, Repository } from 'typeorm';
import { CreateArticleInput, UpdateArticleInput } from './dto/article.input';
import { ArticleRevisionEntity } from './entities/article-revision.entity';
import { ArticleEntity } from './entities/article.entity';
import { canSeeHidenArticle } from './helpers/can-see-hidden';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>,
        @InjectRepository(ArticleRevisionEntity)
        private readonly articleRevisionRepository: Repository<ArticleRevisionEntity>,
        @InjectEntityManager() private readonly entitymanager: EntityManager,
        private readonly markdownMentionService: MarkdownMentionService,
        private readonly opinionService: OpinionService,
        private readonly hidesService: HidesService,
    ) {}

    async comment(
        articleId: string,
        createOpinionInput: CreateOpinionInput,
        currentUser?: CurrentUser,
    ) {
        return this.opinionService.create(
            createOpinionInput,
            await this.articleRepository
                .findOneOrFail({ where: { id: articleId } })
                .then((article) => article.opinionTarget.id),
            currentUser,
        );
    }

    async create(
        currentUser: CurrentUser,
        createArticleInput: CreateArticleInput,
    ) {
        return this.articleRepository.save({
            revisions: [
                this.articleRevisionRepository.create({
                    ...createArticleInput,
                    editedBy: currentUser,
                    mentions: await this.markdownMentionService.getMentions(
                        createArticleInput.content,
                    ),
                }),
            ],
            hideTarget: this.entitymanager.create(HideTargetEntity),
            opinionTarget: this.entitymanager.create(OpinionTargetEntity),
            author: currentUser,
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
                hideTarget: canSeeHidenArticle(currentUser)
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

        return this.articleRevisionRepository.manager.transaction(
            async (manager) => {
                const revision = {
                    ...newestRevision,
                    ...updateArticleInput,
                    editedBy: currentUser,
                };

                article.lastRevision = await manager.save(
                    ArticleRevisionEntity,
                    {
                        ...revision,
                        mentions: await this.markdownMentionService.getMentions(
                            revision.content,
                        ),
                    },
                );

                return manager.save(ArticleEntity, article);
            },
        );
    }
}
