import { Injectable } from '@nestjs/common';
import { ToManyRelationDataloader } from 'common/dataloaders/to-many-relation.dataloader';
import { YoutuberEntity } from '../entities/youtuber.entity';

@Injectable()
export class YoutuberOpinionsDataloader extends ToManyRelationDataloader<
    YoutuberEntity,
    'id',
    'opinions'
> {
    Entity = YoutuberEntity;
    id = 'id' as const;
    relation = 'opinions' as const;
}
