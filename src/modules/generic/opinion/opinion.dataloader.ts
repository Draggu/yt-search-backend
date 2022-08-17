import { Inject, Injectable, Type } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { RelationDataloader } from 'common/dataloaders/relation.dataloader';
import { EntityManager } from 'typeorm';
import { Opinion, OpinionTargetKey } from './consts';
import { OpinionEntity } from './entities/opinion.entity';

@Injectable()
export class OpinionAuthorDataloader extends RelationDataloader(
    OpinionEntity,
    'id',
    'author',
) {}

@Injectable()
export class OpinionTargetDataloader extends RelationDataloader<
    Opinion,
    'id',
    'target'
>('placeholder for entity', 'id', 'target') {
    constructor(
        @Inject(OpinionTargetKey)
        readonly target: Type<Opinion>,
        @InjectEntityManager() readonly entityManager: EntityManager,
    ) {
        super(entityManager);

        this.Entity = target;
    }
}
