import { DEV_NODE_ENVS, PRODUCTION_NODE_ENVS, RE_STRICT_INT } from "./constants";

export const isDevEnv = () => DEV_NODE_ENVS.includes(process.env.NODE_ENV as string); // string | undefined is okay
export const isNotDevEnv = () => !isDevEnv();
export const isProductionEnv = () => PRODUCTION_NODE_ENVS.includes(process.env.NODE_ENV as string); // string | undefined is okay
export const isNotProductionEnv = () => !isProductionEnv();

/**
 * Determine if a value is a signed integer. There are no lower or upper bound constraints.
 *
 * "Strict" contrasts Number.isInteger(1.0) === true, which is bad.
 *
 * @param {any} value = anything
 * @returns {bool} true if it is an integer, false otherwise
 */
export const isStrictInteger = (value: any) => RE_STRICT_INT.test(value);
/**
 * Determine if a value is not a signed integer. There are no lower or upper bound constraints.
 *
 * "Strict" contrasts Number.isInteger(1.0) === true, which is bad.
 *
 * @param {any} value = anything
 * @returns {bool} true if it is not an integer, false otherwise
 */
export const isNotStrictInteger = (value: any) => !isStrictInteger(value);
