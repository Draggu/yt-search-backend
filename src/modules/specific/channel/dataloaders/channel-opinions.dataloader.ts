import { Injectable } from '@nestjs/common';
import { ToManyRelationDataloader } from 'common/dataloaders/to-many-relation.dataloader';
import { ChannelEntity } from '../entities/channel.entity';

@Injectable()
export class ChannelOpinionsDataloader extends ToManyRelationDataloader<
    ChannelEntity,
    'ytId',
    'opinions'
> {
    Entity = ChannelEntity;
    id = 'ytId' as const;
    relation = 'opinions' as const;
}
