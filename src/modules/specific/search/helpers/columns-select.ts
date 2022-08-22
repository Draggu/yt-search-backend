import { SearchResultKind } from '../entities/search-result.entity';
import {
    articleColumns,
    channelColumns,
    regularColumnsList,
    youtuberColumns,
} from './columns-list';

const allColumnsSelect = (kind: SearchResultKind) => {
    const columnsMap = {
        [SearchResultKind.ARTICLE]: articleColumns,
        [SearchResultKind.CHANNEL]: channelColumns,
        [SearchResultKind.YOUTUBER]: youtuberColumns,
    }[kind];

    return [
        ...regularColumnsList.map((column) =>
            columnsMap[column] ? `"${column}"` : `NULL as "${column}"`,
        ),
        columnsMap.id ? 'main.id as id' : 'NULL as id',
        columnsMap.editedAt ? 'rev."editedAt"' : 'NULL as "editedAt"',
        columnsMap.birthday
            ? 'rev.birthday'
            : 'CAST(NULL AS timestamp with time zone) as birthday',
        columnsMap.content ? 'rev.content' : 'NULL as content',
        columnsMap.createdAt ? 'main."createdAt"' : 'NULL as "createdAt"',
        columnsMap.authorId ? 'main."authorId"' : 'NULL as "authorId"',
        `'${kind}' as kind`,
    ];
};

export const articleSelect = allColumnsSelect(SearchResultKind.ARTICLE);
export const channelSelect = allColumnsSelect(SearchResultKind.CHANNEL);
export const youtuberSelect = allColumnsSelect(SearchResultKind.YOUTUBER);
