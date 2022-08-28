import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityTarget, SelectQueryBuilder } from 'typeorm';
import {
    SearchFieldComparison,
    SearchFieldsInput,
} from '../dto/search-fields.input';
import { SearchResultKind } from '../entities/search-result.entity';
import { AllColumns } from '../helpers/columns-list';

@Injectable()
export class SearchQueryService {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

    private createWhere(
        qb: SelectQueryBuilder<unknown>,
        columns: AllColumns,
        fields: SearchFieldsInput,
        query?: string,
    ) {
        const orderedFields = [
            ['createdAt', 'createdAt'],
            ['editedAt', 'editedAt'],
            ['lastSyncWithYT', 'lastRefetch'],
            ['birthday', 'birthday'],
            ['opinions', 'score'],
        ] as const;

        orderedFields.forEach(([field, alias]) => {
            const fieldInput = fields[field];

            if (fieldInput && columns[alias]) {
                qb.andWhere(
                    `alias ${
                        {
                            [SearchFieldComparison.HIGHER]: '<',
                            [SearchFieldComparison.LOWER]: '>',
                        }[fieldInput.comparison]
                    } :${alias}`,
                ).setParameter(alias, fieldInput.value);
            }
        });

        const ftsFields = [
            ['name', 'name'],
            ['realName', '"realName"'],
            ['content', 'rev.content'],
        ] as const;

        ftsFields.forEach(([field, alias]) => {
            const fieldInput = fields[field];
            const paramName = field + '_query';

            if (fieldInput && columns[field]) {
                qb.addSelect(
                    `ts_rank_cd(${alias}::tsvector, websearch_to_tsquery('simple', :${paramName})) as "${field}_rank"`,
                )
                    .andWhere(
                        `websearch_to_tsquery('simple', :${paramName}) @@ ${alias}::tsvector`,
                    )
                    .setParameter(paramName, fieldInput);
            } else {
                qb.addSelect(`NULL as "${field}_rank"`);
            }
        });

        if (query) {
            const accrosField = {
                // prettier-ignore
                [SearchResultKind.YOUTUBER]: `name || ' ' || "realName" || ' ' || rev.content`,
                [SearchResultKind.ARTICLE]: `title || ' ' || rev.content`,
                [SearchResultKind.CHANNEL]: `name || ' ' || rev.content`,
            }[columns.kind];

            qb.addSelect(
                `ts_rank_cd((${accrosField})::tsvector, websearch_to_tsquery('simple', :query)) as query_rank`,
            )
                .andWhere(
                    `websearch_to_tsquery('simple', :query) @@ (${accrosField})::tsvector`,
                )
                .setParameter('query', query);
        }

        const arrayFields = [
            ['author', 'authorId'],
            ['ytId', 'ytId'],
            ['categorieNames', 'categorieName'],
        ] as const;

        arrayFields.forEach(([field, alias]) => {
            const fieldInput = fields[field];

            if (fieldInput && columns[alias]) {
                qb.andWhere(`${alias} IN (:...${alias})`).setParameter(
                    alias,
                    fieldInput,
                );
            }
        });
    }

    createUnion(queryBuilders: SelectQueryBuilder<unknown>[]) {
        const queries = queryBuilders.map((queryBuilder) =>
            queryBuilder.getQuery(),
        );
        const params = queryBuilders.map((queryBuilder) =>
            queryBuilder.getParameters(),
        );

        const sql = queries.join(' UNION ');

        return [sql, params] as const;
    }

    unionPartQb(
        fields: SearchFieldsInput,
        select: string,
        entity: EntityTarget<unknown>,
        columns: AllColumns,
        query?: string,
    ) {
        const qb = this.dataSource
            .createQueryBuilder()
            .select(select)
            .addSelect(
                `AVG(opinions.stars) OVER (PARTITION BY "targetId") AS score`,
            )
            .from(entity, 'main')
            .leftJoin('main.lastRevision', 'rev')
            .leftJoin('main.opinionTarget', 'op_target')
            .leftJoin('op_target.opinions', 'opinions')
            .leftJoin('opinions.hideTarget', 'opinions_hide')
            .andWhere('opinions_hide."isHiden" = false');

        this.createWhere(qb, columns, fields, query);

        return qb;
    }
}
