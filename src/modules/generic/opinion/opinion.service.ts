import { Inject, Injectable, Type } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CurrentUser } from 'directives/auth/types';
import { EntityManager } from 'typeorm';
import { Opinion, OpinionTargetKey } from './consts';
import { CreateOpinionInput } from './dto/create-opinion.input';

@Injectable()
export class OpinionService {
    constructor(
        @Inject(OpinionTargetKey)
        private readonly target: Type<Opinion>,
        @InjectEntityManager() private readonly entityManager: EntityManager,
    ) {}

    create(
        createOpinionInput: CreateOpinionInput,
        targetId: string,
        currentUser?: CurrentUser,
    ) {
        return this.entityManager.getRepository(this.target).save({
            ...createOpinionInput,
            author: currentUser,
            target: {
                id: targetId,
            },
        });
    }
}
