import _ from "lodash";

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
export const removeKeys = <T extends object, K extends keyof T>(
  obj: T,
  remove: K[],
  useClone = true
): Omit<T, K> => {
  const target = useClone ? _.cloneDeep(obj) : obj;
  for (let k of remove) {
    delete target[k]; // eslint-disable-line security/detect-object-injection
  }
  return target;
};
