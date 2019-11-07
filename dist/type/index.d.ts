export declare type Type = "array" | "bigint" | "boolean" | "error" | "function" | "null" | "number" | "object" | "set" | "string" | "symbol" | "undefined";
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
export declare const type: (value: unknown) => Type;
