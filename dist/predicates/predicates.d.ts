import { Monadic } from "./types";
export declare const isDevEnv: (forTesting?: any) => boolean;
export declare const isNotDevEnv: (forTesting?: any) => boolean;
export declare const isProductionEnv: (forTesting?: any) => boolean;
export declare const isNotProductionEnv: (forTesting?: any) => boolean;
/**
 * Determine if a value is a signed integer. There are no lower or upper bound constraints.
 *
 * "Strict" contrasts Number.isInteger(1.0) === true, which is bad.
 *
 * @param {any} value = anything
 * @returns {boolean} true if it is an integer, false otherwise
 */
export declare const isStrictInt: Monadic;
/**
 * Determine if a value is not a signed integer. There are no lower or upper bound constraints.
 *
 * "Strict" contrasts Number.isInteger(1.0) === true, which is bad.
 *
 * @param {any} value = anything
 * @returns {boolean} true if it is not an integer, false otherwise
 */
export declare const isNotStrictInt: Monadic;
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
export declare const isSafeStrictInt: Monadic;
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
export declare const isNotSafeStrictInt: Monadic;
