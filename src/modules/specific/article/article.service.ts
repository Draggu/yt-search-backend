import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'directives/auth/types';
import { EntityManager, Repository } from 'typeorm';
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
    ) {}

    create(currentUser: CurrentUser, createArticleInput: CreateArticleInput) {
        const article = this.articleRepository.create({
            newestContent: this.articleRevisionRepository.create({
                ...createArticleInput,
                editedBy: currentUser,
            }),
            author: currentUser,
        });

        return this.articleRepository.save(article);
    }

    async findOne(id: string) {
        return this.articleRepository.findOne({
            relations: {
                newestContent: true,
            },
            where: {
                id,
                newestContent: {
                    isHiden: false,
                },
            },
        });
    }

    async update(
        currentUser: CurrentUser,
        { id, ...updateArticleInput }: UpdateArticleInput,
    ) {
        const article = await this.articleRepository.findOneOrFail({
            where: { id },
            relations: {
                newestContent: true,
            },
        });

        article.newestContent = this.articleRevisionRepository.create({
            ...article.newestContent,
            ...updateArticleInput,
            editedBy: currentUser,
        });

        return this.articleRepository.save(article);
    }

    getContent(article: ArticleEntity) {
        return this.articleRevisionRepository.findOneOrFail({
            where: {
                article,
            },
        });
    }

    async getAllEditors(article: ArticleEntity) {
        const currentRevision = await this.getContent(article);

        const editors = await this.entityManager
            .getTreeRepository(ArticleRevisionEntity)
            .findAncestors(currentRevision, {
                relations: ['editedBy'],
            });

        return [
            currentRevision.editedBy,
            ...editors.map(({ editedBy }) => editedBy),
        ];
    }

    previousRevision(revision: ArticleRevisionEntity) {
        return this.articleRevisionRepository.findOneOrFail({
            where: {
                next: revision,
            },
        });
    }
}
