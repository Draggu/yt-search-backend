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
                                        'RANK() over (' +
                                            `PARTITION BY entity."${foreignKeyColumn}"` +
                                            `ORDER BY entity."${orderBy.column}" ${orderBy.order}` +
                                            ') as "R"',
                                    ),
                            'entities_with_rank',
                        );

                    keys.forEach(({ id, page: { skip, take } }) => {
                        qb.orWhere(
                            `("${foreignKeyColumn}" = :id AND "R" > :skip AND "R" <= :take)`,
                            {
                                id,
                                skip,
                                take,
                            },
                        );
                    });

                    const entitiesByforeignKeyColumn = _.groupBy(
                        await qb.getRawMany<T>(),
                        foreignKeyColumn,
                    );

                    return keys.map(
                        ({ id: foreignKeyColumn }) =>
                            entitiesByforeignKeyColumn[foreignKeyColumn] || [],
                    );
                },
                {
                    cacheKeyFn: ({
                        id: foreignKeyColumn,
                        page: { skip, take },
                    }) => `${foreignKeyColumn}_${skip}_${take}`,
                },
            );
        }
    }

    return RelationPaginatedDataloader;
};
