"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const fast_safe_stringify_1 = __importDefault(require("fast-safe-stringify"));
const type_1 = require("../type");
const MAX_OBJECT_DISPLAY_SIZE = 200;
// eslint-disable-next-line complexity
exports.getDisplayValueAndType = (value) => {
    const _type = type_1.type(value);
    switch (_type) {
        case "set":
            return { displayValue: `Set {${[...value]}}`, type: _type }; // curly braces, and data
        case "array":
            const stubbedArray = value.map((item) => {
                if (lodash_1.default.isNumber(item) || lodash_1.default.isBoolean(item)) {
                    return item;
                }
                if (lodash_1.default.isString(item)) {
                    return `"${item}"`;
                }
                return type_1.type(item);
            });
            return { displayValue: `[${stubbedArray}]`, type: _type }; // square brackets
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
                displayValue: result.length > MAX_OBJECT_DISPLAY_SIZE ? value : result,
                type: _type,
            };
        default:
            return { displayValue: `${value}`, type: _type };
    }
};
/**
 * Append various details about the value causing the error
 *
 * @param {string} message - The error message to be appended
 * @param {ErrorOptions} options - Control what is appended
 * @returns {string} A string in the form of "message: \n\t suffix"
 */
exports.appendErrorSuffix = (message, options) => {
    let suffix;
    if (options) {
        suffix = "\n";
        const { displayValue, type } = exports.getDisplayValueAndType(options.value);
        suffix += `\ttype:\t\t${type}\n`;
        if (options.showValue) {
            suffix += `\tvalue:\t${displayValue}\n`;
        }
    }
    return suffix !== undefined ? `${message}: ${suffix}` : message;
};
