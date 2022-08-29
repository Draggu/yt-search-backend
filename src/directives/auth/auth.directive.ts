import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlDirectiveFactory } from 'config/graphql.module.config';
import { Request } from 'express';
import { isNonNullType } from 'graphql';
import { filterBoolean } from 'helpers/filter-boolean';
import { SchemaTransform } from 'helpers/schema/transform';
import { TokenService } from 'modules/domain/auth/services/token.service';
import { currentUserSymbol, tokenSymbol, userPromiseSymbol } from './consts';
import { confirmationRule } from './rules/confiramtion.rule';
import { optionalRule } from './rules/optional.rule';
import { ownershipRule } from './rules/ownership.rule';
import { permissionRule } from './rules/permission.rule';
import {
    AuthProperties,
    CurrentUserWithPassword,
    FieldConfig,
    RuleNext,
} from './types';

@Injectable()
export class AuthDirective implements GqlDirectiveFactory {
    constructor(
        private readonly config: ConfigService,
        private readonly tokenService: TokenService,
    ) {}

    readonly typeDefs = /* GraphQL */ `
        """
        requires authorization

        allowed forms:
            - http headers
                - Authorization: Bearer <token>
        """
        directive @auth(
            optional: Boolean = false
            """
            if resource is not owned by current user field is nulled
            """
            onlyOwn: Boolean = false
            """
            there is required additional confirmation by password
            send password in 'Authorization-Confirm' header
            """
            confirmationRequired: Boolean = false
            """
            permissions required to complete action
            authed user MUST have ALL of these permissions
            """
            permissions: [Permissions!] = []
        ) on FIELD_DEFINITION
    `;

    create(): SchemaTransform {
        const disablePermissions: boolean =
            this.config.get('DISABLE_PERMISSIONS', false) &&
            // dont allow this flag in production
            this.config.get('NODE_ENV') !== 'production';

        return (schema) =>
            mapSchema(schema, {
                [MapperKind.FIELD]: (fieldConfig: FieldConfig) => {
                    const directiveArgs = getDirective(
                        schema,
                        fieldConfig,
                        'auth',
                    )?.[0] as AuthProperties | undefined;

                    if (directiveArgs) {
                        // all fields that have ownership must be nullable
                        if (directiveArgs.onlyOwn) {
                            const { type } = fieldConfig;

                            fieldConfig.type = isNonNullType(type)
                                ? type.ofType
                                : type;
                        }

                        const { resolve } = fieldConfig;

                        fieldConfig.resolve = async (
                            parent,
                            args,
                            context,
                            info,
                        ) => {
                            // prevents retrieving user more than once
                            // can be called concurently
                            context.req[userPromiseSymbol] ||=
                                this.setUserFromToken(context.req);

                            const user: CurrentUserWithPassword | undefined =
                                await context.req[userPromiseSymbol];

                            const rules = [
                                confirmationRule(context, user),
                                !disablePermissions && permissionRule(user),
                                optionalRule(user),
                                ownershipRule(parent, info, user),
                            ];

                            // rules are lazy
                            // call next one if they passed
                            const finalResolve = rules
                                .filter(filterBoolean)
                                .reduce(
                                    (nextRule: RuleNext, rule) =>
                                        rule(nextRule, directiveArgs),
                                    () =>
                                        resolve?.(parent, args, context, info),
                                );

                            return finalResolve();
                        };
                    }

                    return fieldConfig;
                },
            });
    }

    private async setUserFromToken(
        req: Request,
    ): Promise<CurrentUserWithPassword | undefined> {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (token) {
            const { password, ...user } = await this.tokenService.getUser(
                token,
            );

            req[tokenSymbol] = token;

            req[currentUserSymbol] = { ...user, passwordHash: password };
        }

        return req[currentUserSymbol];
    }
}
