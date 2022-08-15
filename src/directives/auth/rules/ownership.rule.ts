import * as assert from 'assert';
import { GraphQLResolveInfo } from 'graphql';
import { ownershipKey } from '../consts';
import {
    AuthProperties,
    CurrentUser,
    OwnershipMetadata,
    OwnershipTarget,
    Result,
    RuleNext,
} from '../types';

export const ownershipRule =
    (parent: Result, info: GraphQLResolveInfo, user?: CurrentUser) =>
    (next: RuleNext, directiveArgs: AuthProperties) =>
    async () => {
        if (!directiveArgs.onlyOwn) {
            return next();
        }

        const extension = Object.entries(info.parentType.getFields())
            .filter(([fieldName]) => fieldName === info.fieldName)
            .map(
                ([_, { extensions }]) =>
                    extensions[ownershipKey] ||
                    info.parentType.extensions[ownershipKey],
            )[0] as OwnershipMetadata | undefined;

        assert(
            extension,
            `@auth(ownership=true) has missing extension data on ${info.parentType.name}#${info.fieldName}`,
        );

        const ifAccessGranted = (
            ownerId: string | undefined,
            resultOrNext: ReturnType<RuleNext> | RuleNext,
        ) =>
            user && user.id === ownerId
                ? typeof resultOrNext === 'function'
                    ? resultOrNext()
                    : resultOrNext
                : null;

        if (extension.on === OwnershipTarget.SELF) {
            const result = await next();

            return ifAccessGranted(result?.[extension.field], result);
        }

        return ifAccessGranted(parent[extension.field], next);
    };
