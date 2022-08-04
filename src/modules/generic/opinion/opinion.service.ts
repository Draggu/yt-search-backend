import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CurrentUser } from 'directives/auth/types';
import { EntityManager } from 'typeorm';
import { OpinionTargetKey } from './consts';
import { CreateOpinionInput } from './dto/create-opinion.input';
import { OpinionConfig } from './opinion.module';

@Injectable()
export class OpinionService {
    constructor(
        @Inject(OpinionTargetKey)
        private readonly config: OpinionConfig,
        @InjectEntityManager() private readonly entityManager: EntityManager,
    ) {}

    create(
        createOpinionInput: CreateOpinionInput,
        targetId: string,
        currentUser?: CurrentUser,
    ) {
        return this.entityManager.getRepository(this.config.target).save({
            ...createOpinionInput,
            author: currentUser,
            target: {
                [this.config.idKey]: targetId,
            },
        });
    }
}
