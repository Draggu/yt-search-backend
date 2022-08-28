import { Injectable, Type } from '@nestjs/common';
import { PageInput } from 'common/dto/page';
import * as DataLoader from 'dataloader';
import * as _ from 'lodash';
import { DataSource } from 'typeorm';

export const RelationPaginatedDataloader = <T>(
    entity: Type<T>,
    foreignKeyColumn: keyof T & string,
    orderBy: { column: keyof T & string; order: 'DESC' | 'ASC' },
) => {
    @Injectable()
    class RelationPaginatedDataloader extends DataLoader<
        { id: string; page: PageInput },
        T[],
        string
    > {
        constructor(readonly dataSource: DataSource) {
            const fnKeyColumn =
                dataSource
                    .getMetadata(entity)
                    .findColumnWithPropertyPath(foreignKeyColumn)
                    ?.databaseName || foreignKeyColumn;

            super(
                async (keys) => {
                    const qb = this.dataSource
                        .createQueryBuilder()
                        .select('*')
                        .from<T>(
                            (qb) =>
                                qb
                                    .select('*')
                                    .from(entity, 'entity')
                                    .addSelect(
                                        'ROW_NUMBER() over (' +
                                            `PARTITION BY entity."${fnKeyColumn}" ` +
                                            `ORDER BY entity."${orderBy.column}" ${orderBy.order}` +
                                            ') as r',
                                    ),
                            'entities_with_number',
                        );

                    keys.forEach(({ id, page: { skip, take } }) => {
                        qb.orWhere(
                            `("${fnKeyColumn}" = :id AND r > :skip AND r <= :take)`,
                            {
                                id,
                                skip,
                                take: take + skip,
                            },
                        );
                    });

                    const entitiesBykey = _.groupBy(
                        await qb.getRawMany<T>(),
                        fnKeyColumn,
                    );

                    return keys.map(({ id }) => entitiesBykey[id] || []);
                },
                {
                    cacheKeyFn: ({ id, page: { skip, take } }) =>
                        `${id}_${skip}_${take}`,
                },
            );
        }
    }

    return RelationPaginatedDataloader;
};
