import _ from "lodash";
import safeStringify from "fast-safe-stringify";
import { type, Type } from "../type";
import { SirHelpalotPreconditionError } from "../exception";

export const MAX_OBJECT_DISPLAY_SIZE = 200;
export const MAX_ARRAY_DISPLAY_SIZE = 20;

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

const _getStubbedArray = (arr: any[]): any[] => {
  return arr.map((item: any) => {
    if (_.isArray(item)) {
      const { displayValue, type } = getDisplayValueAndType(item); // ! be careful, pass in item, not arr - else possible recursion error
      return item.length > MAX_ARRAY_DISPLAY_SIZE ? type : displayValue;
    }
    if (_.isNumber(item) || _.isBoolean(item)) {
      return item;
    }
    if (_.isString(item)) {
      return `"${item}"`;
    }
    return type(item);
  });
};

// eslint-disable-next-line complexity
export const getDisplayValueAndType = (value: any): DisplayValueAndType => {
  const _type: Type = type(value);
  switch (_type) {
    case "set":
      const stubbedArray = _getStubbedArray([...value]);
      return { displayValue: `Set {${stubbedArray}}`, type: _type }; // curly braces, and data
    case "array":
      // return type as ddisplayValue if it's too large. This covers a top level array - nested arrays are formatted by _getStubbedArray()
      const dv = value.length > MAX_ARRAY_DISPLAY_SIZE ? _type : `[${_getStubbedArray(value)}]`;
      return { displayValue: dv, type: _type }; // square brackets
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
export const appendErrorSuffix = (message: string, options?: ErrorOptions): string => {
  let suffix: string;
  if (options) {
    const { values } = options;
    if (!_.isPlainObject(values)) {
      throw new SirHelpalotPreconditionError(`error values must be contained within an object`, {
        values: { values },
        showValue: true,
      });
    }

    if (_.isUndefined(options.showValue)) {
      options.showValue = true; // enable by default, because large output is filtered anyway
    }

    suffix = "\n";

    Object.entries(options.values).forEach(([key, value]) => {
      const { displayValue, type } = getDisplayValueAndType(value);

      suffix += `\t--\n\t\t\tname\t\t: ${key}\n\t\t\ttype\t\t: ${type}\n`;

      if (options.showValue) {
        suffix += `\t\t\tvalue\t\t: ${displayValue}\n`;
      }
    });
    suffix += "\t--";
  }
  return suffix! !== undefined ? `${message}: ${suffix}` : message;
};
