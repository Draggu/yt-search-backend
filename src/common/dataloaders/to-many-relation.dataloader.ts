import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as DataLoader from 'dataloader';
import * as _ from 'lodash';
import { EntityManager, EntityTarget } from 'typeorm';

@Injectable()
export abstract class ToManyRelationDataloader<
    E extends object,
    ID extends keyof E & string,
    R extends keyof E & string,
> extends DataLoader<string, E[R]> {
    abstract Entity: EntityTarget<E>;
    abstract relation: R;
    abstract id: ID;

    constructor(
        @InjectEntityManager()
        readonly entityManager: EntityManager,
    ) {
        super(async (ids) => {
            const results = await entityManager
                .createQueryBuilder(this.Entity, 'entity')
                .select([this.id])
                .leftJoin(this.relation, 'relation')
                .where(this.id + ' IN (:...ids)', { ids })
                .getMany();

            const resultsMap = _.groupBy(results, this.id);

            return ids.map(
                (id) =>
                    resultsMap[id].map(
                        (result) => result[this.relation],
                    ) as unknown as E[R], //FIXME better typing
            );
        });
    }
}
