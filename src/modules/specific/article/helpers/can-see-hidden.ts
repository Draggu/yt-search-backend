import { CurrentUser, Permissions } from 'directives/auth/types';

export const canSeeHidenArticle = (currentUser: CurrentUser) =>
    currentUser.permissions.includes(Permissions.EDIT_ARTICLE);
