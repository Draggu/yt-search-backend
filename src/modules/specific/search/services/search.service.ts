import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { PageInput } from 'common/dto/page';
import { filterBoolean } from 'helpers/filter-boolean';
import { DataSource } from 'typeorm';
import { ArticleEntity } from '../../article/entities/article.entity';
import { ChannelEntity } from '../../channel/entities/channel.entity';
import { YoutuberEntity } from '../../youtuber/entities/youtuber.entity';
import { SearchInput } from '../dto/search.input';
import { SearchResult } from '../entities/search-result.entity';
import {
    articleColumns,
    channelColumns,
    youtuberColumns,
} from '../helpers/columns-list';
import {
    articleSelect,
    channelSelect,
    youtuberSelect,
} from '../helpers/columns-select';
import { SearchQueryService } from './query.service';

@Injectable()
export class SearchService {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly queryService: SearchQueryService,
    ) {}

    search(
        { fields, include, query }: SearchInput,
        page: PageInput,
    ): Promise<SearchResult[]> {
        const queryBuilders = [
            include.articles &&
                this.queryService.unionPartQb(
                    fields,
                    articleSelect,
                    ArticleEntity,
                    'targetId',
                    articleColumns,
                    query,
                ),
            include.channels &&
                this.queryService.unionPartQb(
                    fields,
                    channelSelect,
                    ChannelEntity,
                    'targetYtId',
                    channelColumns,
                    query,
                ),
            include.youtubers &&
                this.queryService.unionPartQb(
                    fields,
                    youtuberSelect,
                    YoutuberEntity,
                    'targetId',
                    youtuberColumns,
                    query,
                ),
        ].filter(filterBoolean);

        const [unionQuery, parameters] =
            this.queryService.createUnion(queryBuilders);

        const qb = this.dataSource
            .createQueryBuilder()
            .from(`(${unionQuery})`, 'u')
            .take(page.take)
            .skip(page.skip)
            .orderBy('name_rank', 'DESC', 'NULLS LAST')
            .addOrderBy('"realName_rank"', 'DESC', 'NULLS LAST')
            .addOrderBy('content_rank', 'DESC', 'NULLS LAST');

        if (query) {
            qb.addOrderBy('query_rank', 'DESC', 'NULLS LAST');
        }

        parameters.forEach(qb.setParameters.bind(qb));

        return qb.execute();
    }
}
