import { EnumType, jsonToGraphQLQuery } from 'json-to-graphql-query';
import { AuthProperties } from './types';

export const prepareAuthDirective = (
    authProperties?: Partial<AuthProperties>,
) =>
    jsonToGraphQLQuery({
        '@auth': {
            __args: authProperties?.permissions
                ? {
                      ...authProperties,
                      permissions: authProperties.permissions.map(
                          (permission) => new EnumType(permission),
                      ),
                  }
                : authProperties,
        },
    });
