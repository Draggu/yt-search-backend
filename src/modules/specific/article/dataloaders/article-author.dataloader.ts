import { Injectable } from '@nestjs/common';
import { ToOneRelationDataloader } from 'common/dataloaders/to-one-relation.dataloader';
import { ArticleEntity } from '../entities/article.entity';

@Injectable()
export class ArticleAuthorDataloader extends ToOneRelationDataloader<
    ArticleEntity,
    'id',
    'author'
> {
    Entity = ArticleEntity;
    id = 'id' as const;
    relation = 'author' as const;
}
