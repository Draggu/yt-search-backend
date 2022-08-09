import { Injectable } from '@nestjs/common';
import { ToOneRelationDataloader } from 'common/dataloaders/to-one-relation.dataloader';
import { ChannelRevisionEntity } from '../entities/channel-revision.entity';

@Injectable()
export class ChannelRevisionEditorDataloader extends ToOneRelationDataloader<
    ChannelRevisionEntity,
    'id',
    'editedBy'
> {
    Entity = ChannelRevisionEntity;
    id = 'id' as const;
    relation = 'editedBy' as const;
}
