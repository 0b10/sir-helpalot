import { DEV_NODE_ENVS, PRODUCTION_NODE_ENVS, RE_STRICT_INT } from "./constants";
import { Monadic } from "./types";

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
 * @returns {boolean} true if it is an integer, false otherwise
 */
export const isStrictInt: Monadic = (value: any) =>
  typeof value === "number" && RE_STRICT_INT.test((value as unknown) as string); // any type works

/**
 * Determine if a value is not a signed integer. There are no lower or upper bound constraints.
 *
 * "Strict" contrasts Number.isInteger(1.0) === true, which is bad.
 *
 * @param {any} value = anything
 * @returns {boolean} true if it is not an integer, false otherwise
 */
export const isNotStrictInt: Monadic = (value: any) => !isStrictInt(value);

/**
 * Determine if a value is an integer between MIN_SAFE_INTEGER < n < MAX_SAFE_INTEGER.
 *
 * It first checks for a strict integer, then checks boundaries. Non integer types will return false.
 * Values outside of safe boundaries will return false.
 *
 * "Strict" contrasts Number.isInteger(1.0) === true, which is bad.
 *
 * @param {any} value = anything
 * @returns {boolean} true if it is a strict integer within the specified boundaries, false otherwise
 */
export const isSafeStrictInt: Monadic = (value: any) =>
  isStrictInt(value) && value >= Number.MIN_SAFE_INTEGER && value <= Number.MAX_SAFE_INTEGER;

/**
 * Determine if a value is not an integer between MIN_SAFE_INTEGER < n < MAX_SAFE_INTEGER.
 *
 * It first checks for a strict integer, then checks boundaries. Non integer types will return true.
 * Values outside of safe boundaries will return true.
 *
 * "Strict" contrasts Number.isInteger(1.0) === true, which is bad.
 *
 * @param {any} value = anything
 * @returns {boolean} true if it is not a strict integer within the specified boundaries, false otherwise
 */
export const isNotSafeStrictInt: Monadic = (value: any) => !isSafeStrictInt(value);

// TODO: implement and test these
// const isNonEmptyString = (val: any) => typeof val === "string" && val !== "";
