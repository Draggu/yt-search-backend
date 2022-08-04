import { Request } from 'express';
import { GraphQLFieldConfig } from 'graphql';

export interface AuthProperties {
    optional?: boolean;
    onlyOwn?: boolean;
    confirmationRequired?: boolean;
}

export enum UserPermissions {
    PROPOSE = 'PROPOSE',
    COMMENT = 'COMMENT',
    ACCEPT_PROPOSAL = 'ACCEPT_PROPOSAL',
    WRITE_ARTICLE = 'WRITE_ARTICLE',
    EDIT_ARTICLE = 'EDIT_ARTICLE',
    HIDE_ARTICLE = 'HIDE_ARTICLE',
    SHOW_ARTICLE = 'SHOW_ARTICLE',
}

export type CurrentUser = {
    id: string;
    // permissions: UserPermissions;//TODO
};

export type CurrentUserWithPassword = CurrentUser & {
    passwordHash: string;
};

export type Result = Record<string, string | undefined>;

export type RuleNext = () => Result | null | Promise<Result | null>;

export type OwnershipMetadata = {
    field: string;
    on: OwnershipTarget;
};

export type FieldConfig = GraphQLFieldConfig<Result, { req: Request }, unknown>;

export enum OwnershipTarget {
    SELF = 'self',
    PARENT = 'parent',
}
