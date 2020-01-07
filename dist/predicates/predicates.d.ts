import { Monadic } from './types';
interface ForTestingNodeEnv {
    nodeEnv: any;
}
/**
 * Determine if a development NODE_ENV has been set.
 *
 * The NODE_ENV is cached when the module is loaded - so there are no performance penalties.
 *
 * @param {ForTestingNodeEnv} forTesting - An object that takes a single property - nodeEnv, which
 *  serves as a fake NODE_ENV to test against. This param is only for testing purposes.
 * @returns {boolean} true if NODE_ENV === "dev"|"develop"|"development"|"debug"|"trace"|"test"|
 *  "testing"; false otherwise
 */
export declare const isDevEnv: (forTesting?: ForTestingNodeEnv | undefined) => boolean;
/**
 * Determine if a development NODE_ENV has not been set.
 *
 * The NODE_ENV is cached when the module is loaded - so there are no performance penalties.
 *
 * @param {ForTestingNodeEnv} forTesting - An object that takes a single property - nodeEnv, which
 *  serves as a fake NODE_ENV to test against. This param is only for testing purposes.
 * @returns {boolean} true if NODE_ENV !== "dev"|"develop"|"development"|"debug"|"trace"|"test"|
 *  "testing"; false otherwise
 */
export declare const isNotDevEnv: (forTesting?: ForTestingNodeEnv | undefined) => boolean;
/**
 * Determine if a test NODE_ENV has been set.
 *
 * The NODE_ENV is cached when the module is loaded - so there are no performance penalties.
 *
 * @param {ForTestingNodeEnv} forTesting - An object that takes a single property - nodeEnv, which
 *  serves as a fake NODE_ENV to test against. This param is only for testing purposes.
 * @returns {boolean} true if NODE_ENV === "test"|"testing"; false otherwise
 */
export declare const isTestEnv: (forTesting?: ForTestingNodeEnv | undefined) => boolean;
/**
 * Determine if a test NODE_ENV has not been set.
 *
 * The NODE_ENV is cached when the module is loaded - so there are no performance penalties.
 *
 * @param {ForTestingNodeEnv} forTesting - An object that takes a single property - nodeEnv, which
 *  serves as a fake NODE_ENV to test against. This param is only for testing purposes.
 * @returns {boolean} true if NODE_ENV !== "test"|"testing"; false otherwise
 */
export declare const isNotTestEnv: (forTesting?: ForTestingNodeEnv | undefined) => boolean;
/**
 * Determine if a debug NODE_ENV has been set.
 *
 * The NODE_ENV is cached when the module is loaded - so there are no performance penalties.
 *
 * @param {ForTestingNodeEnv} forTesting - An object that takes a single property - nodeEnv, which
 *  serves as a fake NODE_ENV to test against. This param is only for testing purposes.
 * @returns {boolean} true if NODE_ENV === "debug"|"trace"; false otherwise
 */
export declare const isDebugEnv: (forTesting?: ForTestingNodeEnv | undefined) => boolean;
/**
 * Determine if a debug NODE_ENV has not been set.
 *
 * The NODE_ENV is cached when the module is loaded - so there are no performance penalties.
 *
 * @param {ForTestingNodeEnv} forTesting - An object that takes a single property - nodeEnv, which
 *  serves as a fake NODE_ENV to test against. This param is only for testing purposes.
 * @returns {boolean} true if NODE_ENV !== "debug"|"trace"; false otherwise
 */
export declare const isNotDebugEnv: (forTesting?: ForTestingNodeEnv | undefined) => boolean;
/**
 * Determine if a production NODE_ENV has been set.
 *
 * The NODE_ENV is cached when the module is loaded - so there are no performance penalties.
 *
 * @param {ForTestingNodeEnv} forTesting - An object that takes a single property - nodeEnv, which
 *  serves as a fake NODE_ENV to test against. This param is only for testing purposes.
 * @returns {boolean} true if NODE_ENV === "prod"|"production"|""|undefined; false otherwise
 */
export declare const isProductionEnv: (forTesting?: ForTestingNodeEnv | undefined) => boolean;
/**
 * Determine if a production NODE_ENV has not been set.
 *
 * The NODE_ENV is cached when the module is loaded - so there are no performance penalties.
 *
 * @param {ForTestingNodeEnv} forTesting - An object that takes a single property - nodeEnv, which
 *  serves as a fake NODE_ENV to test against. This param is only for testing purposes.
 * @returns {boolean} true if NODE_ENV !== "prod"|"production"|""|undefined; false otherwise
 */
export declare const isNotProductionEnv: (forTesting?: ForTestingNodeEnv | undefined) => boolean;
/**
 * Determine if a value is a signed integer. There are no lower or upper bound constraints.
 *
 * "Strict" contrasts Number.isInteger(1.0) === true, which is bad.
 *
 * @param {any} value = anything
 * @returns {boolean} true if it is an integer; false otherwise
 */
export declare const isStrictInt: Monadic;
/**
 * Determine if a value is not a signed integer. There are no lower or upper bound constraints.
 *
 * "Strict" contrasts Number.isInteger(1.0) === true, which is bad.
 *
 * @param {any} value = anything
 * @returns {boolean} true if it is not an integer; false otherwise
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
 * @returns {boolean} true if it is a strict integer within the specified boundaries; false otherwise
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
 * @returns {boolean} true if it is not a strict integer within the specified boundaries; false otherwise
 */
export declare const isNotSafeStrictInt: Monadic;
export {};
