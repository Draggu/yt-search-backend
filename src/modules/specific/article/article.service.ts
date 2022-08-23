import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'directives/auth/types';
import { MarkdownMentionService } from 'modules/generic/markdown-mention/markdown-mention.service';
import { Repository } from 'typeorm';
import { CreateArticleInput, UpdateArticleInput } from './dto/article.input';
import { ArticleHideEntity } from './entities/article-hide.entity';
import { ArticleRevisionEntity } from './entities/article-revision.entity';
import { ArticleEntity } from './entities/article.entity';
import { canSeeHidenArticle } from './helpers/can-see-hidden';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>,
        @InjectRepository(ArticleHideEntity)
        private readonly articleHideRepository: Repository<ArticleHideEntity>,
        @InjectRepository(ArticleRevisionEntity)
        private readonly articleRevisionRepository: Repository<ArticleRevisionEntity>,
        private readonly markdownMentionService: MarkdownMentionService,
    ) {}

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
            hides: [
                this.articleHideRepository.create({
                    editedBy: currentUser,
                }),
            ],
            author: currentUser,
        });
    }

    private newestPart(id: string) {
        return {
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
        } as const;
    }

    async changeVisibility(currentUser: CurrentUser, id: string) {
        const articleHide = await this.articleHideRepository.findOneOrFail(
            this.newestPart(id),
        );

        await this.articleHideRepository.save({
            isHiden: !articleHide.isHiden,
            editedBy: currentUser,
            article: articleHide.article,
        });

        return articleHide.article;
    }

    async findOne(id: string, currentUser?: CurrentUser) {
        const findConfig: {
            where: {
                article: {
                    id: string;
                    isHiden?: false;
                };
            };
            relations: {
                article: true;
            };
            order: {
                editedAt: 'DESC';
            };
        } = this.newestPart(id);

        if (!currentUser || !canSeeHidenArticle(currentUser)) {
            findConfig.where.article.isHiden = false;
        }

        const articleHide = await this.articleHideRepository.findOne(
            findConfig,
        );

        return articleHide?.article;
    }

    async update(
        currentUser: CurrentUser,
        { id, ...updateArticleInput }: UpdateArticleInput,
    ) {
        const newestRevision =
            await this.articleRevisionRepository.findOneOrFail(
                this.newestPart(id),
            );

        return this.articleRevisionRepository.manager.transaction(
            async (manager) => {
                const revision = {
                    ...newestRevision,
                    ...updateArticleInput,
                    editedBy: currentUser,
                    article: newestRevision.article,
                };

                newestRevision.article.lastRevision = await manager.save(
                    ArticleRevisionEntity,
                    {
                        ...revision,
                        mentions: await this.markdownMentionService.getMentions(
                            revision.content,
                        ),
                    },
                );

                return manager.save(ArticleEntity, newestRevision.article);
            },
        );
    }
}
