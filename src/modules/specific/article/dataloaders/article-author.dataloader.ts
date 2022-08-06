import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as DataLoader from 'dataloader';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { In, Repository } from 'typeorm';
import { ArticleEntity } from '../entities/article.entity';

@Injectable()
export class ArticleAuthorDataloader extends DataLoader<string, UserEntity> {
    constructor(
        @InjectRepository(ArticleEntity)
        readonly articleRespository: Repository<ArticleEntity>,
    ) {
        super(async (ids) => {
            const authors = await articleRespository.find({
                where: {
                    author: {
                        id: In(ids as string[]),
                    },
                },
                relations: {
                    author: true,
                },
                select: {
                    id: true,
                },
            });

            const authorsMap = Object.fromEntries(
                authors.map(({ id, author }) => [id, author]),
            );

            return ids.map((id) => authorsMap[id]);
        });
    }
}
