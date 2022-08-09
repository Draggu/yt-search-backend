import { Injectable } from '@nestjs/common';
import { ToOneRelationDataloader } from 'common/dataloaders/to-one-relation.dataloader';
import { ChannelEntity } from '../entities/channel.entity';

@Injectable()
export class ChannelContentDataloader extends ToOneRelationDataloader<
    ChannelEntity,
    'ytId',
    'newestContent'
> {
    Entity = ChannelEntity;
    id = 'ytId' as const;
    relation = 'newestContent' as const;
}
