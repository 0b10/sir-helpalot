import _ from "lodash";
import safeStringify from "fast-safe-stringify";
import { type, Type } from "../type";

const MAX_OBJECT_DISPLAY_SIZE = 200;

export interface ErrorOptions {
  value: any;
  showValue?: boolean;
}

export interface DisplayValueAndType {
  displayValue: string;
  type: Type;
}

// eslint-disable-next-line complexity
export const getDisplayValueAndType = (value: any): DisplayValueAndType => {
  const _type: Type = type(value);
  switch (_type) {
    case "set":
      return { displayValue: `Set {${[...value]}}`, type: _type }; // curly braces, and data
    case "array":
      const stubbedArray = value.map((item: any) => {
        if (_.isNumber(item) || _.isBoolean(item)) {
          return item;
        }
        if (_.isString(item)) {
          return `"${item}"`;
        }
        return type(item);
      });
      return { displayValue: `[${stubbedArray}]`, type: _type }; // square brackets
    case "string":
      return { displayValue: value ? value : '""', type: _type }; // empty string as ""
    case "function":
      // "value" is the ErrorOptions key, must be anonymous if its name is that
      const displayValue = value.name ? `${value.name}()` : "() => ...";
      return { displayValue, type: _type };
    case "object":
      const result = safeStringify(value, undefined, 2);
      return {
        // huge objects just clutter output
        displayValue: result.length > MAX_OBJECT_DISPLAY_SIZE ? (value as string) : result,
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
export const appendErrorSuffix = (
  message: string,
  options?: Pick<ErrorOptions, "value" | "showValue">
): string => {
  let suffix: string;
  if (options) {
    suffix = "\n";

    const { displayValue, type } = getDisplayValueAndType(options.value);

    suffix += `\ttype:\t\t${type}\n`;

    if (options.showValue) {
      suffix += `\tvalue:\t${displayValue}\n`;
    }
  }
  return suffix! !== undefined ? `${message}: ${suffix}` : message;
};
