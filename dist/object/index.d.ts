/**
 * WARNING: Be very careful when using this function, do NOT allow any form of user input to be
 *  included into the "remove" array. This function uses object injection, see here for further
 *  reading: https://git.io/JeaRR
 *
 * Remove a list of keys from an object.
 *
 * @param {T} obj - any object
 * @param {string[]} remove - an array of keys to remove
 * @param {boolean} useClone - should the object be cloned first? The result will be a new object if
 *  so
 * @returns {object} An object of the same shape, minus the desired keys
 */
export declare const removeKeys: <T extends object, K extends keyof T>(obj: T, remove: K[], useClone?: boolean) => Pick<T, Exclude<keyof T, K>>;
