import { compare } from 'bcrypt';
import { Request } from 'express';
import { AuthProperties, CurrentUserWithPassword, RuleNext } from '../types';

export const confirmationRule =
    (ctx: { req: Request }, user: CurrentUserWithPassword | undefined) =>
    (next: RuleNext, authProperties: AuthProperties) =>
    async () => {
        if (!authProperties.confirmationRequired) {
            return next();
        }

        const password = ctx.req.header('Authorization-Confirm');

        if (!user || !password) {
            return null;
        }

        const isPasswordCorrect = await compare(password, user.passwordHash);

        return isPasswordCorrect ? next() : null;
    };
