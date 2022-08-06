import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as DataLoader from 'dataloader';
import { EntityManager, In } from 'typeorm';
import { OpinionConfig, OpinionTargetKey } from '../consts';

@Injectable()
export class OpinionTargetDataloader extends DataLoader<string, object> {
    constructor(
        @Inject(OpinionTargetKey)
        readonly config: OpinionConfig,
        @InjectEntityManager() readonly entityManager: EntityManager,
    ) {
        const repo = entityManager.getRepository(config.target);

        super(async (ids) => {
            const opinions = await repo.find({
                where: {
                    id: In(ids as string[]),
                },
                relations: {
                    target: true,
                },
                select: {
                    id: true,
                },
            });

            const opinionsMap = Object.fromEntries(
                opinions.map(({ id, target }) => [id, target]),
            );

            return ids.map((id) => opinionsMap[id]);
        });
    }
}
