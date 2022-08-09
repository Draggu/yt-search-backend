import { Injectable } from '@nestjs/common';
import { ToManyRelationDataloader } from 'common/dataloaders/to-many-relation.dataloader';
import { ArticleEntity } from '../entities/article.entity';

@Injectable()
export class ArticleOpinionsDataloader extends ToManyRelationDataloader<
    ArticleEntity,
    'id',
    'opinions'
> {
    Entity = ArticleEntity;
    id = 'id' as const;
    relation = 'opinions' as const;
}
