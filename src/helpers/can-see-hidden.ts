import { CurrentUser, Permissions } from 'directives/auth/types';

export const canSeeHiden = (currentUser?: CurrentUser) =>
    !!currentUser?.permissions.includes(Permissions.TOGGLE_HIDE);
