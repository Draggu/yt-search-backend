import { Injectable, Type } from '@nestjs/common';
import { PageInput } from 'common/dto/page';
import * as DataLoader from 'dataloader';
import { CurrentUser } from 'directives/auth/types';
import { canSeeHiden } from 'helpers/can-see-hidden';
import * as _ from 'lodash';
import { HideTargetEntity } from 'modules/domain/hides/entities/hide-target.entity';
import { DataSource, SelectQueryBuilder } from 'typeorm';

export const RelationPaginatedDataloader = <T>(
    entity: Type<T>,
    foreignKeyColumn: keyof T & string,
    orderBy: { column: keyof T & string; order: 'DESC' | 'ASC' },
    extra?: (qb: SelectQueryBuilder<T>) => void,
) => {
    @Injectable()
    class RelationPaginatedDataloader extends DataLoader<
        { id: string; page: PageInput; currentUser?: CurrentUser },
        T[],
        string
    > {
        constructor(readonly dataSource: DataSource) {
            const metadata = dataSource.getMetadata(entity);
            const fnKeyColumn =
                metadata.findColumnWithPropertyPath(foreignKeyColumn)
                    ?.databaseName || foreignKeyColumn;
            const hidenProperty = metadata.relations.find(
                (meta) =>
                    meta.inverseEntityMetadata.target === HideTargetEntity &&
                    meta.relationType === 'one-to-one',
            )?.propertyName;

            super(
                async (keys) => {
                    const qb = this.dataSource
                        .createQueryBuilder()
                        .select('*')
                        .from<T>((qb) => {
                            qb.select('*')
                                .from(entity, 'entity')
                                .addSelect(
                                    'ROW_NUMBER() over (' +
                                        `PARTITION BY entity."${fnKeyColumn}" ` +
                                        `ORDER BY entity."${orderBy.column}" ${orderBy.order}` +
                                        ') as r',
                                );

                            if (hidenProperty) {
                                qb.addSelect('hide."isHiden"').leftJoin(
                                    `entity.${hidenProperty}`,
                                    'hide',
                                );
                            }

                            extra?.(qb);

                            return qb;
                        }, 'entities_with_number');

                    keys.forEach(
                        ({ id, page: { skip, take }, currentUser }) => {
                            qb.orWhere(
                                `("${fnKeyColumn}" = :id AND r > :skip AND r <= :take${
                                    hidenProperty && !canSeeHiden(currentUser)
                                        ? ' AND "isHiden" IS NOT TRUE'
                                        : ''
                                })`,
                                {
                                    id,
                                    skip,
                                    take: take + skip,
                                },
                            );
                        },
                    );

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
