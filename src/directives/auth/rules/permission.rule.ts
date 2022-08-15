import { AuthProperties, CurrentUser, RuleNext } from '../types';

export const permissionRule =
    (user: CurrentUser | undefined) =>
    (next: RuleNext, authProperties: AuthProperties) =>
    () =>
        authProperties.permissions.every((permission) =>
            user?.permissions.includes(permission),
        )
            ? next()
            : null;
