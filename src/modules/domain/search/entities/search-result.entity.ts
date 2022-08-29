import { createUnionType } from '@nestjs/graphql';
import { ArticleEntity } from 'modules/domain/article/entities/article.entity';
import { ChannelEntity } from 'modules/domain/channel/entities/channel.entity';
import { YoutuberEntity } from 'modules/domain/youtuber/entities/youtuber.entity';

export enum SearchResultKind {
    ARTICLE = 'ARTICLE',
    YOUTUBER = 'YOUTUBER',
    CHANNEL = 'CHANNEL',
}

export const SearchResult = createUnionType({
    name: 'SearchResult',
    types: () => [ArticleEntity, YoutuberEntity, ChannelEntity],
    resolveType: (
        element: (ArticleEntity | YoutuberEntity | ChannelEntity) & {
            kind: SearchResultKind;
        },
    ) =>
        ({
            [SearchResultKind.ARTICLE]: ArticleEntity,
            [SearchResultKind.YOUTUBER]: YoutuberEntity,
            [SearchResultKind.CHANNEL]: ChannelEntity,
        }[element.kind]),
});

export type SearchResult = typeof SearchResult;
