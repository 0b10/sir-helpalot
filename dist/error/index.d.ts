import { Type } from "../type";
export declare const MAX_OBJECT_DISPLAY_SIZE = 200;
export declare const MAX_ARRAY_DISPLAY_SIZE = 20;
export interface ErrorValues {
    [key: string]: any;
}
export interface ErrorOptions {
    values: ErrorValues;
    showValue?: boolean;
}
export interface DisplayValueAndType {
    displayValue: string;
    type: Type;
}
export declare const getDisplayValueAndType: (value: any) => DisplayValueAndType;
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
export declare const appendErrorSuffix: (message: string, options?: ErrorOptions | undefined) => string;
