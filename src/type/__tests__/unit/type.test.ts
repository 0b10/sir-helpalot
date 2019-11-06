import fc from "fast-check";
import _ from "lodash";

import { Type, type } from "../../index";

const fakeFunc = () => null; // used to test for function arg

interface DirectValues {
  values: any[];
  description: string;
}

interface Fixture {
  expected: Type;
  directValues?: DirectValues;
  notEqualsDirectValues?: DirectValues; // check that values do not return expected
  properties?: {
    pre: (input: any) => ReturnType<typeof fc.pre>;
    arbitraries: Array<() => fc.Arbitrary<any>>;
    description: string;
  };
  canBeUndefined?: boolean;
}

const fixtures: Fixture[] = [
  // +++ string +++
  {
    directValues: {
      values: ["", "test"],
      description: 'should return "string" when given a specific string value',
    },
    properties: {
      pre: (input: any) => true,
      arbitraries: [() => fc.string()],
      description: 'should return "string" when given any string',
    },
    expected: "string",
  },
  // +++ number +++
  {
    directValues: {
      values: [0, 1, 1.1],
      description: 'should return "number" when given a specific number value',
    },
    notEqualsDirectValues: {
      values: ["1", "1.1", BigInt(1)],
      description: 'should not return "number" when given number strings, or bigint values',
    },
    properties: {
      pre: (input: any) => true,
      arbitraries: [() => fc.integer(), () => fc.float()],
      description: 'should return "number" when given any number',
    },
    expected: "number",
  },
  // +++ object +++
  {
    directValues: {
      values: [{}, { a: "" }],
      description: 'should return "object" when given a specific object value',
    },
    notEqualsDirectValues: {
      values: [null, []],
      description: 'should not return "object" when given null or array',
    },
    properties: {
      pre: (input: any) => true,
      arbitraries: [() => fc.object()],
      description: 'should return "object" when given any object',
    },
    expected: "object",
  },
  // +++ array +++
  {
    directValues: {
      values: [[], [1, 2, 3]],
      description: 'should return "array" when given a specific array value',
    },
    notEqualsDirectValues: {
      values: [null, {}],
      description: 'should not return "array" when given null or object',
    },
    properties: {
      pre: (input: any) => true,
      arbitraries: [() => fc.array(fc.string())],
      description: 'should return "array" when given any array',
    },
    expected: "array",
  },
  // +++ set +++
  {
    directValues: {
      values: [
        new Set([]),
        new Set([1, 2, 3]),
        new Set(["1", "2", "3"]),
        new Set([null]),
        new Set([{}, {}]),
      ],
      description: 'should return "set" when given a specific Set value',
    },
    expected: "set",
  },
  // +++ function +++
  {
    directValues: {
      values: [
        () => null,
        function foo() {
          return null;
        },
        fakeFunc,
      ],
      description: 'should return "function" when given a specific function value',
    },
    properties: {
      pre: (input: any) => true,
      arbitraries: [() => fc.func(fc.string())],
      description: 'should return "function" when given any function',
    },
    expected: "function",
  },
  // +++ null +++
  {
    directValues: {
      values: [null],
      description: 'should return "null" when given a specific null value',
    },
    notEqualsDirectValues: {
      values: [[], {}],
      description: 'should not return "null" when given array or object',
    },
    expected: "null",
  },
  // +++ undefined +++
  {
    directValues: {
      values: [undefined],
      description: 'should return "undefined" when given a specific undefined value',
    },
    expected: "undefined",
  },
  // +++ boolean +++
  {
    directValues: {
      values: [true, false],
      description: 'should return "boolean" when given a specific boolean value',
    },
    notEqualsDirectValues: {
      values: ["", null, undefined],
      description: 'should not return "boolean" when given "", null, or undefined',
    },
    expected: "boolean",
  },
  // +++ bigint +++
  {
    expected: "bigint",
    properties: {
      pre: (input: any) => true,
      arbitraries: [() => fc.bigInt()],
      description: 'should return "bigint" when given any bigint value',
    },
  },
  // +++ symbol +++
  {
    expected: "symbol",
    directValues: {
      values: [Symbol(), Symbol("foo")],
      description: 'should return "symbol" when given a specific Symbol value',
    },
  },
  // +++ error +++
  {
    expected: "error",
    directValues: {
      values: [new Error(), new RangeError(), new TypeError()],
      description: 'should return "error" when given a specific Error object',
    },
  },
];

fixtures.forEach(({ expected, directValues, notEqualsDirectValues, properties }) => {
  describe(`for ${expected} values`, () => {
    if (directValues) {
      const { values, description } = directValues;
      it(description, () => {
        for (let input of values) {
          const failureMessage = `${{ input }}`;
          expect(type(input), failureMessage).toBe(expected);
        }
      });
    }

    if (notEqualsDirectValues) {
      const { values, description } = notEqualsDirectValues;
      it(description, () => {
        for (let input of values) {
          const failureMessage = `${{ input }}`;
          expect(type(input), failureMessage).not.toBe(expected);
        }
      });
    }

    if (properties) {
      const { arbitraries, description, pre } = properties;
      it(description, () => {
        arbitraries.forEach((arbitrary) => {
          fc.assert(
            fc.property(arbitrary(), (input) => {
              pre(input);
              return type(input) === expected;
            }),
            { verbose: true }
          );
        });
      });
    }
  });
});
