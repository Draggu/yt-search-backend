import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getRequest } from 'helpers/get-request';
import { tokenSymbol } from '../consts';

/**
 * requires use of @Auth()
 */
export const Token = createParamDecorator(
    (_: unknown, ctx: ExecutionContext) => getRequest(ctx)[tokenSymbol],
);
