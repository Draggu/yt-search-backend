import { applyDecorators, UseGuards } from '@nestjs/common';
import { Directive } from '@nestjs/graphql';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { RecaptchaV3Guard } from './recaptcha-v3.guard';

export const RecaptchaV3 = (actionName: string) =>
    applyDecorators(
        UseGuards(RecaptchaV3Guard(actionName)),
        Directive(
            jsonToGraphQLQuery({ '@recaptchaV3': { __args: { actionName } } }),
        ),
    );
