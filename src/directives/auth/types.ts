import { registerEnumType } from '@nestjs/graphql';
import { Request } from 'express';
import { GraphQLFieldConfig } from 'graphql';

export interface AuthProperties {
    optional: boolean;
    onlyOwn: boolean;
    confirmationRequired: boolean;
    permissions: Permissions[];
}

export enum Permissions {
    PROPOSE = 'PROPOSE',
    COMMENT = 'COMMENT',
    ACCEPT_PROPOSAL = 'ACCEPT_PROPOSAL',
    WRITE_ARTICLE = 'WRITE_ARTICLE',
    EDIT_ARTICLE = 'EDIT_ARTICLE',
    HIDE_ARTICLE = 'HIDE_ARTICLE',
    SHOW_ARTICLE = 'SHOW_ARTICLE',
    MODIFY_PERMISSION = 'MODIFY_PERMISSION',
}

registerEnumType(Permissions, {
    name: 'Permissions',
});

export type CurrentUser = {
    id: string;
    permissions: Permissions[];
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
