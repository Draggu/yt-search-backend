import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as DataLoader from 'dataloader';
import { UserEntity } from 'modules/specific/user/entities/user.entity';
import { In, Repository } from 'typeorm';
import { ArticleRevisionEntity } from '../entities/article-revision.entity';

@Injectable()
export class ArticleRevisionEditorDataloader extends DataLoader<
    string,
    UserEntity
> {
    constructor(
        @InjectRepository(ArticleRevisionEntity)
        readonly articleRespository: Repository<ArticleRevisionEntity>,
    ) {
        super(async (ids) => {
            const authors = await articleRespository.find({
                where: {
                    editedBy: {
                        id: In(ids as string[]),
                    },
                },
                relations: {
                    editedBy: true,
                },
                select: {
                    id: true,
                },
            });

            const authorsMap = Object.fromEntries(
                authors.map(({ id, editedBy }) => [id, editedBy]),
            );

            return ids.map((id) => authorsMap[id]);
        });
    }
}
