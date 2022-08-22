import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser, Permissions } from 'directives/auth/types';
import { Repository } from 'typeorm';
import { CreateArticleInput, UpdateArticleInput } from './dto/article.input';
import { ArticleHideEntity } from './entities/article-hide.entity';
import { ArticleRevisionEntity } from './entities/article-revision.entity';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>,
        @InjectRepository(ArticleHideEntity)
        private readonly articleHideRepository: Repository<ArticleHideEntity>,
        @InjectRepository(ArticleRevisionEntity)
        private readonly articleRevisionRepository: Repository<ArticleRevisionEntity>,
    ) {}

    create(currentUser: CurrentUser, createArticleInput: CreateArticleInput) {
        return this.articleRepository.save({
            revisions: [
                this.articleRevisionRepository.create({
                    ...createArticleInput,
                    editedBy: currentUser,
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
        const articleHide = await this.articleHideRepository.findOne(
            this.newestPart(id),
        );

        //TODO use this logic in search too
        const canSeeHiden = currentUser?.permissions.includes(
            Permissions.EDIT_ARTICLE,
        );

        return articleHide && (!articleHide.isHiden || canSeeHiden)
            ? articleHide.article
            : null;
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
                newestRevision.article.lastRevision = await manager.save(
                    ArticleRevisionEntity,
                    {
                        ...newestRevision,
                        ...updateArticleInput,
                        editedBy: currentUser,
                        article: newestRevision.article,
                    },
                );

                return manager.save(ArticleEntity, newestRevision.article);
            },
        );
    }
}
