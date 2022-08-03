import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'directives/auth/types';
import { Repository } from 'typeorm';
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
}
