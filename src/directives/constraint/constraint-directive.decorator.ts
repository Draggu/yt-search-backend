import { Directive } from '@nestjs/graphql';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

export interface ConstraintArgs {
    minLength?: number;
    maxLength?: number;
    startsWith?: string;
    endsWith?: string;
    contains?: string;
    notContains?: string;
    pattern?: string;
    format?:
        | 'byte'
        | 'date-time'
        | 'date'
        | 'email'
        | 'ipv4'
        | 'ipv6'
        | 'uri'
        | 'uuid';
    min?: number;
    max?: number;
    exclusiveMin?: number;
    exclusiveMax?: number;
    multipleOf?: number;
    uniqueTypeName?: string;
}

export const ConstraintDirective = (options: ConstraintArgs) =>
    Directive(
        jsonToGraphQLQuery({
            '@constraint': {
                __args: options,
            },
        }),
    );
