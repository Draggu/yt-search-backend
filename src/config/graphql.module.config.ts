import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { cors } from 'common/cors';
import { AuthDirective } from 'directives/auth/auth.directive';
import { recaptchaV3TypeDefs } from 'directives/recaptcha-v3/recaptcha-v3.directive';
import { lexicographicSortSchema } from 'graphql';
import {
    constraintDirective,
    constraintDirectiveTypeDefs,
} from 'graphql-constraint-directive';
import { printSchemaToFile } from 'helpers/schema/print';
import { SchemaTransform, transformSchema } from 'helpers/schema/transform';

export interface GqlDirectiveFactory {
    typeDefs: string;
    create(): SchemaTransform;
}

@Injectable()
export class GraphQlModuleConfig implements GqlOptionsFactory {
    constructor(
        private readonly config: ConfigService,
        private readonly authDirective: AuthDirective,
    ) {}

    createGqlOptions(): Omit<ApolloDriverConfig, 'driver'> {
        return {
            cors,
            debug: this.config.get('NODE_ENV') !== 'production',
            playground: false,
            autoSchemaFile: true,
            transformAutoSchemaFile: true,
            fieldResolverEnhancers: ['guards'],
            transformSchema: transformSchema({
                beforePrint: [
                    this.authDirective.create(),
                    lexicographicSortSchema,
                ],
                afterPrint: [constraintDirective()],
                typeDefs: [
                    constraintDirectiveTypeDefs,
                    this.authDirective.typeDefs,
                    recaptchaV3TypeDefs,
                ],
                print: printSchemaToFile('schema.gql'),
            }),
            context: ({ req }) => ({ req }),
            buildSchemaOptions: {
                orphanedTypes: [],
            },
        };
    }
}
