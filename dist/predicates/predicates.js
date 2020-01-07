"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const constants_1 = require("./constants");
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
exports.isDevEnv = (forTesting) => constants_1.DEV_NODE_ENVS.has(!lodash_1.default.isUndefined(forTesting) ? forTesting : NODE_ENV); // string | undefined is okay
/**
 * Determine if a development NODE_ENV has not been set.
 *
 * The NODE_ENV is cached when the module is loaded - so there are no performance penalties.
 *
 * @param {any} forTesting - A fake NODE_ENV that can be passed in to test for.
 * @returns {boolean} true if NODE_ENV !== "dev"|"develop"|"development"|"debug"|"trace"|"test"|
 *  "testing"; false otherwise
 */
exports.isNotDevEnv = (forTesting) => !exports.isDevEnv(forTesting);
/**
 * Determine if a test NODE_ENV has been set.
 *
 * The NODE_ENV is cached when the module is loaded - so there are no performance penalties.
 *
 * @param {any} forTesting - A fake NODE_ENV that can be passed in to test for.
 * @returns {boolean} true if NODE_ENV === "test"|"testing"; false otherwise
 */
exports.isTestEnv = (forTesting) => constants_1.TEST_NODE_ENVS.has(!lodash_1.default.isUndefined(forTesting) ? forTesting : NODE_ENV); // string | undefined is okay
/**
 * Determine if a test NODE_ENV has not been set.
 *
 * The NODE_ENV is cached when the module is loaded - so there are no performance penalties.
 *
 * @param {any} forTesting - A fake NODE_ENV that can be passed in to test for.
 * @returns {boolean} true if NODE_ENV !== "test"|"testing"; false otherwise
 */
exports.isNotTestEnv = (forTesting) => !exports.isTestEnv(forTesting);
/**
 * Determine if a debug NODE_ENV has been set.
 *
 * The NODE_ENV is cached when the module is loaded - so there are no performance penalties.
 *
 * @param {any} forTesting - A fake NODE_ENV that can be passed in to test for.
 * @returns {boolean} true if NODE_ENV === "debug"|"trace"; false otherwise
 */
exports.isDebugEnv = (forTesting) => constants_1.DEBUG_NODE_ENVS.has(!lodash_1.default.isUndefined(forTesting) ? forTesting : NODE_ENV); // string | undefined is okay
/**
 * Determine if a debug NODE_ENV has not been set.
 *
 * The NODE_ENV is cached when the module is loaded - so there are no performance penalties.
 *
 * @param {any} forTesting - A fake NODE_ENV that can be passed in to test for.
 * @returns {boolean} true if NODE_ENV !== "debug"|"trace"; false otherwise
 */
exports.isNotDebugEnv = (forTesting) => !exports.isDebugEnv(forTesting);
/**
 * Determine if a production NODE_ENV has been set.
 *
 * The NODE_ENV is cached when the module is loaded - so there are no performance penalties.
 *
 * @param {any} forTesting - A fake NODE_ENV that can be passed in to test for.
 * @returns {boolean} true if NODE_ENV === "prod"|"production"|""|undefined; false otherwise
 */
exports.isProductionEnv = (forTesting) => constants_1.PRODUCTION_NODE_ENVS.has(!lodash_1.default.isUndefined(forTesting) ? forTesting : NODE_ENV); // string | undefined is okay
/**
 * Determine if a production NODE_ENV has not been set.
 *
 * The NODE_ENV is cached when the module is loaded - so there are no performance penalties.
 *
 * @param {any} forTesting - A fake NODE_ENV that can be passed in to test for.
 * @returns {boolean} true if NODE_ENV !== "prod"|"production"|""|undefined; false otherwise
 */
exports.isNotProductionEnv = (forTesting) => !exports.isProductionEnv(forTesting);
/**
 * Determine if a value is a signed integer. There are no lower or upper bound constraints.
 *
 * "Strict" contrasts Number.isInteger(1.0) === true, which is bad.
 *
 * @param {any} value = anything
 * @returns {boolean} true if it is an integer; false otherwise
 */
exports.isStrictInt = (value) => typeof value === 'number' && constants_1.RE_STRICT_INT.test(value); // any type works
/**
 * Determine if a value is not a signed integer. There are no lower or upper bound constraints.
 *
 * "Strict" contrasts Number.isInteger(1.0) === true, which is bad.
 *
 * @param {any} value = anything
 * @returns {boolean} true if it is not an integer; false otherwise
 */
exports.isNotStrictInt = (value) => !exports.isStrictInt(value);
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
exports.isSafeStrictInt = (value) => exports.isStrictInt(value) && value >= Number.MIN_SAFE_INTEGER && value <= Number.MAX_SAFE_INTEGER;
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
exports.isNotSafeStrictInt = (value) => !exports.isSafeStrictInt(value);
// TODO: implement and test these
// const isNonEmptyString = (val: any) => typeof val === "string" && val !== "";
