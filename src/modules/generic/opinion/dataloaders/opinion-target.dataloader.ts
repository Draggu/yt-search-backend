import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ToOneRelationDataloader } from 'common/dataloaders/to-one-relation.dataloader';
import { EntityManager, EntityTarget } from 'typeorm';
import { Opinion, OpinionConfig, OpinionTargetKey } from '../consts';

@Injectable()
export class OpinionTargetDataloader extends ToOneRelationDataloader<
    Opinion,
    'id',
    'target'
> {
    Entity: EntityTarget<Opinion>;
    id = 'id' as const;
    relation = 'target' as const;

    constructor(
        @Inject(OpinionTargetKey)
        readonly config: OpinionConfig,
        @InjectEntityManager() readonly entityManager: EntityManager,
    ) {
        super(entityManager);

        this.Entity = config.target;
    }
}
