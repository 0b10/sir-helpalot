import _ from "lodash";
import fc from "fast-check";

import { appendErrorSuffix, ErrorOptions } from "../../index";
import { SirHelpalotPreconditionError } from "../../../exception";

// ! these don't need to be tested thoroughly because getDisplayValueAndType, and type() are both
// !  tested extensively. Just test the formatting and logic, not the values.

describe("for strings", () => {
  const input = "a fake value string";
  it("should return a string with only a message when no options are given", () => {
    expect(appendErrorSuffix("a test message")).toMatchSnapshot();
  });

  it("should return a string with only a message and a type when showValue is false", () => {
    expect(
      appendErrorSuffix("a test message", { values: { input }, showValue: false })
    ).toMatchSnapshot();
  });

  it("should return a string with a message, type, and value when showValue is true", () => {
    expect(
      appendErrorSuffix("a test message", { values: { input }, showValue: true })
    ).toMatchSnapshot();
  });
});

describe("for arrays", () => {
  const input = [1, 2, 3];
  it("should return a string with only a message when no options are given", () => {
    expect(appendErrorSuffix("a test message")).toMatchSnapshot();
  });

  it("should return a string with only a message and a type when showValue is false", () => {
    expect(
      appendErrorSuffix("a test message", { values: { input }, showValue: false })
    ).toMatchSnapshot();
  });

  it("should return a string with a message, type, and value when showValue is true", () => {
    expect(
      appendErrorSuffix("a test message", { values: { input }, showValue: true })
    ).toMatchSnapshot();
  });
});

describe("for functions", () => {
  const input = () => null;
  it("should return a string with only a message when no options are given", () => {
    expect(appendErrorSuffix("a test message")).toMatchSnapshot();
  });

  it("should return a string with only a message and a type when showValue is false", () => {
    expect(
      appendErrorSuffix("a test message", { values: { input }, showValue: false })
    ).toMatchSnapshot();
  });

  it("should return a string with a message, type, and value when showValue is true", () => {
    expect(
      appendErrorSuffix("a test message", { values: { input }, showValue: true })
    ).toMatchSnapshot();
  });
});

describe("for mixed arrays", () => {
  const input = [() => null, {}, new Error(), null, undefined];
  it("should return a string with only a message when no options are given", () => {
    expect(appendErrorSuffix("a test message")).toMatchSnapshot();
  });

  it("should return a string with only a message and a type when showValue is false", () => {
    expect(
      appendErrorSuffix("a test message", { values: { input }, showValue: false })
    ).toMatchSnapshot();
  });

  it("should return a string with a message, type, and value when showValue is true", () => {
    expect(
      appendErrorSuffix("a test message", { values: { input }, showValue: true })
    ).toMatchSnapshot();
  });
});

describe("multiple values", () => {
  it("should be returned as a string in an expected format", () => {
    expect(
      appendErrorSuffix("a test message", {
        values: { a: { foo: "foo", bar: "bar" }, b: [1, 1.1, "a string"], c: () => null },
        showValue: true,
      })
    ).toMatchSnapshot();
  });
});

describe("show value", () => {
  it("should be enabled by default", () => {
    expect(
      appendErrorSuffix("a test message", {
        values: { a: true },
      })
    ).toMatchSnapshot();
  });

  it("should display the value when explicity asked", () => {
    expect(
      appendErrorSuffix("a test message", {
        values: { a: true },
        showValue: true,
      })
    ).toMatchSnapshot();
  });

  it("should not display the value when explicity asked not to", () => {
    expect(
      appendErrorSuffix("a test message", {
        values: { a: true },
        showValue: false,
      })
    ).toMatchSnapshot();
  });
});

describe("non-object values", () => {
  it("should throw for a boolean", () => {
    expect(() =>
      appendErrorSuffix("a test message", ({ values: false } as unknown) as ErrorOptions)
    ).toThrow(SirHelpalotPreconditionError);
  });

  it("should throw for any non-object value for values", () => {
    fc.assert(
      fc.property(fc.anything(), (input) => {
        fc.pre(!_.isPlainObject(input));
        try {
          appendErrorSuffix("arbitrary message", { values: input as any });
        } catch (error) {
          if (error instanceof SirHelpalotPreconditionError) {
            return true;
          }
        }
        return false;
      })
    ),
      { verbose: true };
  });
});
