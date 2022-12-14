import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as DataLoader from 'dataloader';
import * as _ from 'lodash';
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
    class RelationDataloader extends DataLoader<string, E[R]> {
        constructor(
            @InjectEntityManager()
            readonly entityManager: EntityManager,
        ) {
            super(async (ids) => {
                const results = await entityManager
                    .createQueryBuilder(Entity, 'entity')
                    .select(`entity.${id}`)
                    .leftJoinAndSelect(`entity.${relation}`, 'relation')
                    .where(`entity.${id} IN (:...ids)`, { ids })
                    .getMany();

                const resultsMap = _.keyBy(results, id);

                return ids.map((id) => resultsMap[id][relation]);
            });
        }
    }

    return RelationDataloader;
};
