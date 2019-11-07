"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const object_1 = require("../object");
const _conditionallyFreeze = (obj, defaultImmutable, args) => {
    if (args && lodash_1.default.isBoolean(args.immutable)) {
        // when args.immutable is boolean, it has been manually set - this value now takes precedence.
        //  However, it's undefined by default
        return args.immutable ? Object.freeze(obj) : obj;
    }
    return defaultImmutable ? Object.freeze(obj) : obj;
};
/**
 * A flexible closure to provide fixture data in a way that reduces test code. Pass in an
 *  object to the closure, which will represent any arguments you will use in tests. This object
 *  represents the default values that you require, and the returned function allows you to override
 *  those values, or completely remove keys. The resulting object can also be made immutable, to
 *  provide some extra safety during tests.
 *
 * NOTE: defaults and overrides are deep cloned, so there is no need to freeze, or clone them. The
 *  function was written with safety (data integrity) in mind.
 *
 * @author 0b10
 *
 * @param {object} defaults - The object that you wish to serve as default values. This can be any
 *  shape.
 * @param {FixtureOptions} options - { immutable: true } - The object produced by the inner function
 *  (aka helper) is immutable by default. This can be overridden via the helper.
 *
 * @returns {Function} A helper function: (overrides, options) => ({...defaults, ...overrides})
 *
 * options = { overrides?, exclude?, immutable? }
 *
 * overrides: { ... }:
 *
 *  This will override any value in defaults by merging them, including undefined - which means the
 *  key will exist with an explicit undefined value. If you want to exclude a key, use the exclude
 *  option.
 *
 * exclude: [ ]:
 *
 *  Keys of the result to delete - this is useful if setting a key to undefined is not an option.
 *
 * immutable: false:
 *
 *  Should the result be immutable? This overrides the immutable option within the outer (closure)
 *  function - this value takes precedence. This freezes the result.
 *
 * @example
 * const myHelper = fixture({ a: "a"});
 * const { a } = myHelper();
 *
 * @example
 * const myHelper = fixture({ a: "", b: "" }, { immutable: false });
 * const { a } = myHelper({ exclude: ["a"] });
 *
 * @example
 * const myHelper = fixture({ a: "", b: "" });
 * const { a, b } = myHelper({ overrides: { a: "example", b: undefined } });
 *
 * @example
 * const myHelper = fixture({ a: "" });
 * const { a, b } = myHelper({ immutable: true });
 */
// TODO: preserve Readonly when closure immutable option is set. I currently do not know how to do
//  this, but the helper immutable option should take precedence over the closure immutable option.
exports.fixture = (defaults, { immutable } = { immutable: true }) => {
    const clonedDefaults = lodash_1.default.cloneDeep(defaults);
    function helper(args) {
        if (args) {
            const clonedOverrides = lodash_1.default.cloneDeep(args.overrides);
            const merged = { ...clonedDefaults, ...clonedOverrides };
            // remove keys
            if (!lodash_1.default.isUndefined(args.exclude)) {
                const withoutKeys = object_1.removeKeys(merged, args.exclude);
                return _conditionallyFreeze(withoutKeys, immutable, args);
            }
            // else use merged
            return _conditionallyFreeze(merged, immutable, args);
        }
        // don't merge, use defaults only
        return _conditionallyFreeze(clonedDefaults, immutable, args);
    }
    return helper;
};
