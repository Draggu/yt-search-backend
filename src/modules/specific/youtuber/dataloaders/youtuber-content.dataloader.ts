import { Injectable } from '@nestjs/common';
import { ToOneRelationDataloader } from 'common/dataloaders/to-one-relation.dataloader';
import { YoutuberEntity } from '../entities/youtuber.entity';

@Injectable()
export class YoutuberContentDataloader extends ToOneRelationDataloader<
    YoutuberEntity,
    'id',
    'newestContent'
> {
    Entity = YoutuberEntity;
    id = 'id' as const;
    relation = 'newestContent' as const;
}
