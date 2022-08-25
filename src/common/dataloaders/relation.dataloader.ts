import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as DataLoader from 'dataloader';
import { EntityManager, EntityTarget } from 'typeorm';

export const RelationDataloader = <
    E extends object,
    ID extends keyof E & string,
    R extends keyof E & string,
>(
    Entity: EntityTarget<E>,
    id: ID,
    relation: R,
) => {
    @Injectable()
    class _ToOneRelationDataloader extends DataLoader<string, E[R]> {
        constructor(
            @InjectEntityManager()
            readonly entityManager: EntityManager,
        ) {
            super(async (ids) => {
                const results = await entityManager
                    .createQueryBuilder(Entity, 'entity')
                    .select([`entity.${id}`])
                    .leftJoinAndSelect('entity.' + relation, 'relation')
                    .where(`entity.${id} IN (:...ids)`, { ids })
                    .getMany();

                const resultsMap = Object.fromEntries(
                    results.map((result) => [result[id], result[relation]]),
                );

                return ids.map((id) => resultsMap[id]);
            });
        }
    }

    return _ToOneRelationDataloader;
};
