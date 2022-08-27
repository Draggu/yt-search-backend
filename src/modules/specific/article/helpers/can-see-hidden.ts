import { CurrentUser, Permissions } from 'directives/auth/types';

export const canSeeHidenArticle = (currentUser?: CurrentUser) =>
    currentUser && currentUser.permissions.includes(Permissions.EDIT_ARTICLE);
