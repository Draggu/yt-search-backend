import { Injectable } from '@nestjs/common';
import { ToOneRelationDataloader } from 'common/dataloaders/to-one-relation.dataloader';
import { ArticleRevisionEntity } from '../entities/article-revision.entity';

@Injectable()
export class ArticleRevisionEditorDataloader extends ToOneRelationDataloader<
    ArticleRevisionEntity,
    'id',
    'editedBy'
> {
    Entity = ArticleRevisionEntity;
    id = 'id' as const;
    relation = 'editedBy' as const;
}
