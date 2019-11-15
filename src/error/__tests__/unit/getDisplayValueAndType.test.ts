import fc from "fast-check";
import _ from "lodash";

import safeStringify from "fast-safe-stringify";

import { getDisplayValueAndType, DisplayValueAndType, MAX_ARRAY_DISPLAY_SIZE } from "../../index";
import { Type } from "../../../type";

interface DirectValues {
  input: any;
  description: string;
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
      },
      {
        input: "test",
        description: 'should return "string" as type and "test" for the displayValue',
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
      },
      {
        input: false,
        description: 'should return "boolean" as type and "false" for the displayValue',
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
      },
      {
        input: 1.1,
        description: 'should return "number" as type and "1.1" for the displayValue',
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
  // +++ bigint +++
  {
    targetType: "bigint",
    directValues: [
      {
        input: BigInt(1),
        description: 'should return "bigint" as type and "1n" for the displayValue',
      },
      {
        input: BigInt(0),
        description: 'should return "bigint" as type and "0n" for the displayValue',
      },
      {
        input: BigInt(-23984786),
        description: 'should return "bigint" as type and "-23984786n" for the displayValue',
      },
      {
        input: BigInt(873487687),
        description: 'should return "bigint" as type and "873487687n" for the displayValue',
      },
    ],
  },
  // +++ set +++
  {
    targetType: "set",
    directValues: [
      {
        input: new Set([]),
        description: 'should return "set" as type and "Set {}" for the displayValue',
      },
      {
        input: new Set([1, 2, 3]),
        description: 'should return "set" as type and "Set {1,2,3}" for the displayValue',
      },
      {
        input: new Set([[1, 2, 3], [4, 5, 6]]),
        description: 'should return "set" as type and "Set {1,2,3,4,5,6}" for the displayValue',
      },
      {
        input: new Set([{ a: "a" }, { b: "b" }]),
        description:
          'should return "set" as type and "Set {[object Object],[object Object]}" for the displayValue',
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
      },
      {
        input: [1, 2, 3],
        description: "should return the correct type/displayValue when given an array of integers",
      },
      {
        input: ["string1", "string2"],
        description: "should return the correct type/displayValue when given an array of strings",
      },
      {
        input: ["", ""],
        description:
          "should return the correct type/displayValue when given an array of empty strings",
      },
      {
        input: [{ a: "a" }, { b: "b" }],
        description: "should return the correct type/displayValue when given an array of objects",
      },
      {
        input: [1.0, 1.1, 1.2],
        description: "should return the correct type/displayValue when given an array of floats",
      },
      {
        input: [
          () => null,
          function foo() {
            return null;
          },
        ],
        description: "should return the correct type/displayValue when given an array of functions",
      },
      {
        input: [null],
        description: "should return the correct type/displayValue when given an array of null",
      },
      {
        input: [undefined, undefined],
        description: "should return the correct type/displayValue when given an array of undefined",
      },
      {
        input: [
          [1, 2, ["a", "b", [() => null, {}]]],
          [
            [new Error("arbitrary message"), 5, null, BigInt(1)],
            [undefined, 8, [() => null, true, [1.1, 10, new Set([1, 2, [4, 5, 6]])]]],
          ],
        ],
        description: "should return a correctly recusrively resolved array",
      },
      {
        input: _.fill(Array(MAX_ARRAY_DISPLAY_SIZE + 1), "a"),
        description: `should return the type instead of the display value when length > ${MAX_ARRAY_DISPLAY_SIZE}`,
      },
      {
        input: _.fill(
          Array(MAX_ARRAY_DISPLAY_SIZE),
          _.fill(Array(MAX_ARRAY_DISPLAY_SIZE + 1), "a")
        ),
        description: `should return an array of "array" types, when sub-arrays are too large`,
      },
      {
        input: _.fill(
          Array(MAX_ARRAY_DISPLAY_SIZE + 1),
          _.fill(Array(MAX_ARRAY_DISPLAY_SIZE + 1), "a")
        ),
        description: `should return just "array" type when it contains too many large arrays`,
      },
      {
        input: _.fill(Array(10), _.fill(Array(2), _.fill(Array(MAX_ARRAY_DISPLAY_SIZE + 1), "a"))),
        description: `should return an array of arrays with "array" types, when sub-sub-arrays are too large`,
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
      },
      {
        input: { a: "a", b: { c: "c" } },
        description:
          "should return the correct type/displayValue when given an object with no two props and nested object",
      },
      {
        input: {},
        description:
          "should return the correct type/displayValue when given an object with no props",
      },
    ],
  },
];

fixtures.forEach(({ targetType, directValues, properties }) => {
  describe(`for ${targetType} values`, () => {
    if (directValues) {
      directValues.forEach(({ description, input }) => {
        it(description, () => {
          const failureMessage = `${{ input }}`;
          expect(getDisplayValueAndType(input), failureMessage).toMatchSnapshot();
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
