"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const fast_safe_stringify_1 = __importDefault(require("fast-safe-stringify"));
const type_1 = require("../type");
const exception_1 = require("../exception");
exports.MAX_OBJECT_DISPLAY_SIZE = 200;
exports.MAX_ARRAY_DISPLAY_SIZE = 20;
const _getStubbedArray = (arr) => {
    return arr.map((item) => {
        if (lodash_1.default.isArray(item)) {
            const { displayValue, type } = exports.getDisplayValueAndType(item); // ! be careful, pass in item, not arr - else possible recursion error
            return item.length > exports.MAX_ARRAY_DISPLAY_SIZE ? type : displayValue;
        }
        if (lodash_1.default.isNumber(item) || lodash_1.default.isBoolean(item)) {
            return item;
        }
        if (lodash_1.default.isString(item)) {
            return `"${item}"`;
        }
        return type_1.type(item);
    });
};
// eslint-disable-next-line complexity
exports.getDisplayValueAndType = (value) => {
    const _type = type_1.type(value);
    switch (_type) {
        case "set":
            const stubbedArray = _getStubbedArray([...value]);
            return { displayValue: `Set {${stubbedArray}}`, type: _type }; // curly braces, and data
        case "array":
            // return type as ddisplayValue if it's too large. This covers a top level array - nested arrays are formatted by _getStubbedArray()
            const dv = value.length > exports.MAX_ARRAY_DISPLAY_SIZE ? _type : `[${_getStubbedArray(value)}]`;
            return { displayValue: dv, type: _type }; // square brackets
        case "string":
            return { displayValue: value ? value : '""', type: _type }; // empty string as ""
        case "function":
            // "value" is the ErrorOptions key, must be anonymous if its name is that
            const displayValue = value.name ? `${value.name}()` : "() => ...";
            return { displayValue, type: _type };
        case "object":
            const result = fast_safe_stringify_1.default(value, undefined, 2);
            return {
                // huge objects just clutter output
                displayValue: result.length > exports.MAX_OBJECT_DISPLAY_SIZE ? value : result,
                type: _type,
            };
        case "bigint":
            return { displayValue: `${value}n`, type: _type }; // conversion to string removes 'n'
        default:
            return { displayValue: `${value}`, type: _type };
    }
};
/**
 * Append various details about the value causing the error
 *
 * @param {string} message - The error message to be appended
 * @param {ErrorOptions} options - Control what is appended:-
 *
 *  { values: object, showValue?: boolean }
 *
 *  values is an object, whose keys are the names of the variables.
 *
 *  showValue is enabled by default, and constrols whether the value of the variable/property is
 *  displayed. Large output is filtered, things like functions, and large objects. Strings and numbers
 *  are not. When a value is filtered, it is replaced with a placeholder value - sometimes a type,
 *  othertimes: someFunc()
 *
 * @returns {string} A string in the form of "message: \n\t suffix"
 *
 * @example
 * appendErrorSuffix("foo", { values: { a: "string a", b: "string b" });
 */
exports.appendErrorSuffix = (message, options) => {
    let suffix;
    if (options) {
        const { values } = options;
        if (!lodash_1.default.isPlainObject(values)) {
            throw new exception_1.SirHelpalotPreconditionError(`error values must be contained within an object`, {
                values: { values },
                showValue: true,
            });
        }
        if (lodash_1.default.isUndefined(options.showValue)) {
            options.showValue = true; // enable by default, because large output is filtered anyway
        }
        suffix = "\n";
        Object.entries(options.values).forEach(([key, value]) => {
            const { displayValue, type } = exports.getDisplayValueAndType(value);
            suffix += `  --\n    name   : ${key}\n    type   : ${type}\n`;
            if (options.showValue) {
                suffix += `    value  : ${displayValue}\n`;
            }
        });
        suffix += "  --";
    }
    return suffix !== undefined ? `${message}: ${suffix}` : message; // return just the message if no suffix
};
