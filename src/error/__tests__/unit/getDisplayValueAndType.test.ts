import fc from "fast-check";
import _ from "lodash";

import safeStringify from "fast-safe-stringify";

import { getDisplayValueAndType, DisplayValueAndType } from "../../index";
import { Type } from "../../../type";

interface DirectValues {
  input: any;
  description: string;
  expected: DisplayValueAndType;
}

interface Fixture {
  targetType: Type;
  directValues?: DirectValues[];
  properties?: {
    // property based tests are limited here, they check that input === displayValue, so mutated
    //  display values you should write directValue tests for
    pre: (input: any) => ReturnType<typeof fc.pre>;
    arbitraries: Array<() => fc.Arbitrary<any>>;
    description: string;
    expectedType: Type;
  };
}

const fixtures: Fixture[] = [
  // +++ string +++
  {
    targetType: "string",
    directValues: [
      {
        input: "",
        description: 'should return "string" as type and "" for the displayValue',
        expected: { type: "string", displayValue: '""' },
      },
      {
        input: "test",
        description: 'should return "string" as type and "test" for the displayValue',
        expected: { type: "string", displayValue: "test" },
      },
    ],
    properties: {
      pre: (input: any) => fc.pre(input !== ""), // ignore empty string, because it's transformed into "" - with literal quotes
      arbitraries: [() => fc.string()],
      description:
        'should return "string" as type and a the exact same string for the displayValue',
      expectedType: "string",
    },
  },
  // +++ boolean +++
  {
    targetType: "boolean",
    directValues: [
      {
        input: true,
        description: 'should return "boolean" as type and "true" for the displayValue',
        expected: { type: "boolean", displayValue: "true" },
      },
      {
        input: false,
        description: 'should return "boolean" as type and "false" for the displayValue',
        expected: { type: "boolean", displayValue: "false" },
      },
    ],
  },
  // +++ number +++
  {
    targetType: "number",
    directValues: [
      {
        input: 1,
        description: 'should return "number" as type and "1" for the displayValue',
        expected: { type: "number", displayValue: "1" },
      },
      {
        input: 1.1,
        description: 'should return "number" as type and "1.1" for the displayValue',
        expected: { type: "number", displayValue: "1.1" },
      },
    ],
    properties: {
      pre: (input: any) => fc.pre(input !== ""), // ignore empty number, because it's transformed into "" - with literal quotes
      arbitraries: [() => fc.integer(), () => fc.float()],
      description:
        'should return "number" as type and a the exact same number as a string for the displayValue',
      expectedType: "number",
    },
  },
  // +++ set +++
  {
    targetType: "set",
    directValues: [
      {
        input: new Set([]),
        description: 'should return "set" as type and "Set {}" for the displayValue',
        expected: { type: "set", displayValue: "Set {}" },
      },
      {
        input: new Set([1, 2, 3]),
        description: 'should return "set" as type and "Set {1,2,3}" for the displayValue',
        expected: { type: "set", displayValue: "Set {1,2,3}" },
      },
      {
        input: new Set([[1, 2, 3], [4, 5, 6]]),
        description: 'should return "set" as type and "Set {1,2,3,4,5,6}" for the displayValue',
        expected: { type: "set", displayValue: "Set {1,2,3,4,5,6}" },
      },
      {
        input: new Set([{ a: "a" }, { b: "b" }]),
        description:
          'should return "set" as type and "Set {[object Object],[object Object]}" for the displayValue',
        expected: { type: "set", displayValue: "Set {[object Object],[object Object]}" },
      },
    ],
  },
  // +++ array +++
  {
    targetType: "array",
    directValues: [
      {
        input: [],
        description: "should return the correct type/displayValue when given an empty array",
        expected: { type: "array", displayValue: "[]" },
      },
      {
        input: [1, 2, 3],
        description: "should return the correct type/displayValue when given an array of integers",
        expected: { type: "array", displayValue: "[1,2,3]" },
      },
      {
        input: ["string1", "string2"],
        description: "should return the correct type/displayValue when given an array of strings",
        expected: { type: "array", displayValue: '["string1","string2"]' },
      },
      {
        input: ["", ""],
        description:
          "should return the correct type/displayValue when given an array of empty strings",
        expected: { type: "array", displayValue: '["",""]' },
      },
      {
        input: [{ a: "a" }, { b: "b" }],
        description: "should return the correct type/displayValue when given an array of objects",
        expected: { type: "array", displayValue: "[object,object]" },
      },
      {
        input: [1.0, 1.1, 1.2],
        description: "should return the correct type/displayValue when given an array of floats",
        expected: { type: "array", displayValue: "[1,1.1,1.2]" }, // I don't really care about 1.0 => 1
      },
      {
        input: [
          () => null,
          function foo() {
            return null;
          },
        ],
        description: "should return the correct type/displayValue when given an array of functions",
        expected: { type: "array", displayValue: "[function,function]" },
      },
      {
        input: [null],
        description: "should return the correct type/displayValue when given an array of null",
        expected: { type: "array", displayValue: "[null]" },
      },
      {
        input: [undefined, undefined],
        description: "should return the correct type/displayValue when given an array of undefined",
        expected: { type: "array", displayValue: "[undefined,undefined]" },
      },
    ],
  },
  // +++ function +++
  {
    targetType: "function",
    directValues: [
      {
        input: () => null,
        description:
          'should return "function" as type and a stubbed function string for the displayValue',
        expected: { type: "function", displayValue: "input()" },
      },
    ],
  },
  // +++ object +++
  {
    targetType: "object",
    directValues: [
      {
        input: { a: "a" },
        description:
          "should return the correct type/displayValue when given an object with one prop",
        expected: { type: "object", displayValue: safeStringify({ a: "a" }, undefined, 2) },
      },
      {
        input: { a: "a", b: { c: "c" } },
        description:
          "should return the correct type/displayValue when given an object with no two props and nested object",
        expected: {
          type: "object",
          displayValue: safeStringify({ a: "a", b: { c: "c" } }, undefined, 2),
        },
      },
      {
        input: {},
        description:
          "should return the correct type/displayValue when given an object with no props",
        expected: { type: "object", displayValue: "{}" },
      },
    ],
  },
];

fixtures.forEach(({ targetType, directValues, properties }) => {
  describe(`for ${targetType} values`, () => {
    if (directValues) {
      directValues.forEach(({ description, input, expected }) => {
        it(description, () => {
          const failureMessage = `${{ input }}`;
          expect(getDisplayValueAndType(input), failureMessage).toStrictEqual(expected);
        });
      });
    }

    if (properties) {
      const { arbitraries, description, pre, expectedType } = properties;
      it(description, () => {
        arbitraries.forEach((arbitrary) => {
          fc.assert(
            fc.property(arbitrary(), (input) => {
              pre(input);
              return _.isEqual(getDisplayValueAndType(input), {
                type: expectedType,
                displayValue: `${input}`,
              });
            }),
            { verbose: true }
          );
        });
      });
    }
  });
});
