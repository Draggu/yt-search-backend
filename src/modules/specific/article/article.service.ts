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
        return this.articleRepository.save({
            newestContent: this.articleRevisionRepository.create({
                ...createArticleInput,
                editedBy: currentUser,
            }),
            author: currentUser,
        });
    }

    async findOne(id: string) {
        return this.articleRepository.findOne({
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
        });

        article.newestContent = this.articleRevisionRepository.create({
            ...article.newestContent,
            ...updateArticleInput,
            editedBy: currentUser,
            previous: article,
        });

        return this.articleRepository.save(article);
    }
}
