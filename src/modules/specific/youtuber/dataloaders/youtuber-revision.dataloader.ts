import { Injectable } from '@nestjs/common';
import { ToOneRelationDataloader } from 'common/dataloaders/to-one-relation.dataloader';
import { YoutuberRevisionEntity } from '../entities/youtuber-revision.entity';

@Injectable()
export class YoutuberRevisionEditorDataloader extends ToOneRelationDataloader<
    YoutuberRevisionEntity,
    'id',
    'editedBy'
> {
    Entity = YoutuberRevisionEntity;
    id = 'id' as const;
    relation = 'editedBy' as const;
}
