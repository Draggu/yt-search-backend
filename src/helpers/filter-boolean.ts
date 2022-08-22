export const filterBoolean = <T>(
    x: T | false | 0 | undefined | null | '',
): x is T => !!x;
