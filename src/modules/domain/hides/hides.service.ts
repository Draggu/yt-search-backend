import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as assert from 'assert';
import { CurrentUser } from 'directives/auth/types';
import { EntityManager } from 'typeorm';
import { CreateHideInput } from './dto/create-hide.input';
import { HideTargetEntity } from './entities/hide-target.entity';
import { HideEntity } from './entities/hide.entity';

@Injectable()
export class HidesService {
    constructor(
        @InjectEntityManager() private readonly entityManager: EntityManager,
    ) {}

    createTarget() {
        return this.entityManager.create(HideTargetEntity);
    }

    toogleHide(
        currentUser: CurrentUser,
        targetId: string,
        createHideInput: CreateHideInput,
    ) {
        return this.entityManager.transaction(async (manager) => {
            const result: { isHiden: boolean } | undefined = await manager
                .createQueryBuilder(HideTargetEntity, 'target')
                .update()
                .set({
                    isHiden: () => 'NOT "isHiden"',
                })
                .where('id = :id', { id: targetId })
                .returning('"isHiden"')
                .execute()
                .then(({ raw }) => raw[0]);

            assert(result);

            return manager.getRepository(HideEntity).save({
                ...createHideInput,
                isHiden: result.isHiden,
                target: {
                    id: targetId,
                },
                editedBy: currentUser,
            });
        });
    }
}
