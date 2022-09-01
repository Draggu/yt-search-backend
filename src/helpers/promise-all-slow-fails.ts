export const promiseAllSlowFail = async <T extends readonly unknown[] | []>(
    promises: T,
) => {
    await Promise.allSettled(promises);

    return Promise.all(promises);
};
