import { Injectable } from '@nestjs/common';
import { ToOneRelationDataloader } from 'common/dataloaders/to-one-relation.dataloader';
import { OpinionEntity } from '../entities/opinion.entity';

@Injectable()
export class OpinionAuthorDataloader extends ToOneRelationDataloader<
    OpinionEntity,
    'id',
    'author'
> {
    Entity = OpinionEntity;
    id = 'id' as const;
    relation = 'author' as const;
}
