import { CurrentUserWithPassword } from './types';

export const currentUserSymbol = Symbol('current user key on ctx');

export const tokenSymbol = Symbol('current user token key on ctx');

export const userPromiseSymbol = Symbol('user promise on req');

export const ownershipKey = 'ownershipKey';

export const tokenKey = 'tokenKey';

declare module 'express' {
    interface Request {
        [tokenSymbol]?: string;
        [currentUserSymbol]?: CurrentUserWithPassword;
        [userPromiseSymbol]?: Promise<CurrentUserWithPassword | undefined>;
    }
}
