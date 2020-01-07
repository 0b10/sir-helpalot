import _ from 'lodash';
import {
  DEBUG_NODE_ENVS,
  DEV_NODE_ENVS,
  PRODUCTION_NODE_ENVS,
  RE_STRICT_INT,
  TEST_NODE_ENVS,
} from './constants';
import { Monadic } from './types';

const NODE_ENV = process.env.NODE_ENV;

/**
 * Determine if a development NODE_ENV has been set.
 *
 * The NODE_ENV is cached when the module is loaded - so there are no performance penalties.
 *
 * @param {any} forTesting - A fake NODE_ENV that can be passed in to test for.
 * @returns {boolean} true if NODE_ENV === "dev"|"develop"|"development"|"debug"|"trace"|"test"|
 *  "testing"; false otherwise
 */
export const isDevEnv = (forTesting?: any) =>
  DEV_NODE_ENVS.has(!_.isUndefined(forTesting) ? forTesting : (NODE_ENV as string)); // string | undefined is okay

/**
 * Determine if a development NODE_ENV has not been set.
 *
 * The NODE_ENV is cached when the module is loaded - so there are no performance penalties.
 *
 * @param {any} forTesting - A fake NODE_ENV that can be passed in to test for.
 * @returns {boolean} true if NODE_ENV !== "dev"|"develop"|"development"|"debug"|"trace"|"test"|
 *  "testing"; false otherwise
 */
export const isNotDevEnv = (forTesting?: any) => !isDevEnv(forTesting);

/**
 * Determine if a test NODE_ENV has been set.
 *
 * The NODE_ENV is cached when the module is loaded - so there are no performance penalties.
 *
 * @param {any} forTesting - A fake NODE_ENV that can be passed in to test for.
 * @returns {boolean} true if NODE_ENV === "test"|"testing"; false otherwise
 */
export const isTestEnv = (forTesting?: any) =>
  TEST_NODE_ENVS.has(!_.isUndefined(forTesting) ? forTesting : (NODE_ENV as string)); // string | undefined is okay

/**
 * Determine if a test NODE_ENV has not been set.
 *
 * The NODE_ENV is cached when the module is loaded - so there are no performance penalties.
 *
 * @param {any} forTesting - A fake NODE_ENV that can be passed in to test for.
 * @returns {boolean} true if NODE_ENV !== "test"|"testing"; false otherwise
 */
export const isNotTestEnv = (forTesting?: any) => !isTestEnv(forTesting);

/**
 * Determine if a debug NODE_ENV has been set.
 *
 * The NODE_ENV is cached when the module is loaded - so there are no performance penalties.
 *
 * @param {any} forTesting - A fake NODE_ENV that can be passed in to test for.
 * @returns {boolean} true if NODE_ENV === "debug"|"trace"; false otherwise
 */
export const isDebugEnv = (forTesting?: any) =>
  DEBUG_NODE_ENVS.has(!_.isUndefined(forTesting) ? forTesting : (NODE_ENV as string)); // string | undefined is okay

/**
 * Determine if a debug NODE_ENV has not been set.
 *
 * The NODE_ENV is cached when the module is loaded - so there are no performance penalties.
 *
 * @param {any} forTesting - A fake NODE_ENV that can be passed in to test for.
 * @returns {boolean} true if NODE_ENV !== "debug"|"trace"; false otherwise
 */
export const isNotDebugEnv = (forTesting?: any) => !isDebugEnv(forTesting);

/**
 * Determine if a production NODE_ENV has been set.
 *
 * The NODE_ENV is cached when the module is loaded - so there are no performance penalties.
 *
 * @param {any} forTesting - A fake NODE_ENV that can be passed in to test for.
 * @returns {boolean} true if NODE_ENV === "prod"|"production"|""|undefined; false otherwise
 */
export const isProductionEnv = (forTesting?: any) =>
  PRODUCTION_NODE_ENVS.has(!_.isUndefined(forTesting) ? forTesting : (NODE_ENV as string)); // string | undefined is okay

/**
 * Determine if a production NODE_ENV has not been set.
 *
 * The NODE_ENV is cached when the module is loaded - so there are no performance penalties.
 *
 * @param {any} forTesting - A fake NODE_ENV that can be passed in to test for.
 * @returns {boolean} true if NODE_ENV !== "prod"|"production"|""|undefined; false otherwise
 */
export const isNotProductionEnv = (forTesting?: any) => !isProductionEnv(forTesting);

/**
 * Determine if a value is a signed integer. There are no lower or upper bound constraints.
 *
 * "Strict" contrasts Number.isInteger(1.0) === true, which is bad.
 *
 * @param {any} value = anything
 * @returns {boolean} true if it is an integer; false otherwise
 */
export const isStrictInt: Monadic = (value: any) =>
  typeof value === 'number' && RE_STRICT_INT.test((value as unknown) as string); // any type works

/**
 * Determine if a value is not a signed integer. There are no lower or upper bound constraints.
 *
 * "Strict" contrasts Number.isInteger(1.0) === true, which is bad.
 *
 * @param {any} value = anything
 * @returns {boolean} true if it is not an integer; false otherwise
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
 * @returns {boolean} true if it is a strict integer within the specified boundaries; false otherwise
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
 * @returns {boolean} true if it is not a strict integer within the specified boundaries; false otherwise
 */
export const isNotSafeStrictInt: Monadic = (value: any) => !isSafeStrictInt(value);

// TODO: implement and test these
// const isNonEmptyString = (val: any) => typeof val === "string" && val !== "";
