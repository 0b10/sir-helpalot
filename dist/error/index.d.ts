import { Type } from "../type";
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
 * @param {ErrorOptions} options - Control what is appended
 * @returns {string} A string in the form of "message: \n\t suffix"
 */
export declare const appendErrorSuffix: (message: string, options?: ErrorOptions | undefined) => string;
