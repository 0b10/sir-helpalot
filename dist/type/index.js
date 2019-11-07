"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
/**
 * Get the type, in string form, of the value. These values are more constrained than typeof - for
 *  instance null is "null", not "object"; array is "array", not "object".
 *
 * This isn't really for type evaluation, but for textual context - although you can use it for type
 *  evaluation, you could just use lodash's lib instead, which also do type assertions via the
 *  typings lib.
 *
 * @param {unknown} value any value
 * @returns {Type} a textual representation of the type.
 */
exports.type = (value) => {
    return lodash_1.default.isArray(value)
        ? "array"
        : lodash_1.default.isNull(value)
            ? "null"
            : lodash_1.default.isSet(value)
                ? "set"
                : lodash_1.default.isError(value)
                    ? "error"
                    : typeof value;
};
