import { SearchResultKind } from '../entities/search-result.entity';

export interface AllColumns {
    kind: SearchResultKind;
    id: boolean;
    createdAt: boolean;
    editedAt: boolean;
    lastRefetch: boolean;
    birthday: boolean;
    name: boolean;
    realName: boolean;
    title: boolean;
    content: boolean;
    score: boolean;
    ytId: boolean;
    authorId: boolean;
    categorieName: boolean;
}

export const regularColumnsList = Object.freeze<(keyof AllColumns)[]>([
    'lastRefetch',
    'name',
    'realName',
    'title',
    'ytId',
]);

export const articleColumns: AllColumns = {
    kind: SearchResultKind.ARTICLE,
    id: true,
    createdAt: true,
    editedAt: true,
    lastRefetch: false,
    birthday: false,
    name: false,
    realName: false,
    title: true,
    content: true,
    score: true,
    ytId: false,
    authorId: true,
    categorieName: true,
};

export const channelColumns: AllColumns = {
    kind: SearchResultKind.CHANNEL,
    id: false,
    createdAt: false,
    editedAt: true,
    lastRefetch: true,
    birthday: false,
    name: true,
    realName: false,
    title: false,
    content: true,
    score: true,
    ytId: true,
    authorId: false,
    categorieName: true,
};

export const youtuberColumns: AllColumns = {
    kind: SearchResultKind.YOUTUBER,
    id: true,
    createdAt: false,
    editedAt: true,
    lastRefetch: false,
    birthday: true,
    name: true,
    realName: true,
    title: false,
    content: true,
    score: true,
    ytId: false,
    authorId: false,
    categorieName: true,
};
