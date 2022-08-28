import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { PageInput } from 'common/dto/page';
import { CurrentUser } from 'directives/auth/types';
import { canSeeHiden } from 'helpers/can-see-hidden';
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
        currentUser?: CurrentUser,
    ): Promise<SearchResult[]> {
        const articleQb =
            include.articles &&
            this.queryService.unionPartQb(
                fields,
                articleSelect,
                ArticleEntity,
                articleColumns,
                query,
            );
        const channelQb =
            include.channels &&
            this.queryService.unionPartQb(
                fields,
                channelSelect,
                ChannelEntity,
                channelColumns,
                query,
            );
        const youtuberQb =
            include.youtubers &&
            this.queryService.unionPartQb(
                fields,
                youtuberSelect,
                YoutuberEntity,
                youtuberColumns,
                query,
            );

        if (articleQb && !canSeeHiden(currentUser)) {
            articleQb
                .leftJoin('main.hideTarget', 'hide')
                .andWhere('hide."isHiden" IS NOT TRUE');
        }

        const [unionQuery, parameters] = this.queryService.createUnion(
            [articleQb, channelQb, youtuberQb].filter(filterBoolean),
        );

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
