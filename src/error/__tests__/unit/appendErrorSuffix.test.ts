import _ from "lodash";

import { appendErrorSuffix } from "../../index";

// ! these don't need to be tested thoroughly because getDisplayValueAndType, and type() are both
// !  tested extensively. Just test the formatting and logic, not the values.

describe("for strings", () => {
  const input = "a fake value string";
  it("should return a string with only a message when no options are given", () => {
    expect(appendErrorSuffix("a test message")).toMatchSnapshot();
  });

  it("should return a string with only a message and a type when showValue is false", () => {
    expect(
      appendErrorSuffix("a test message", { value: input, showValue: false })
    ).toMatchSnapshot();
  });

  it("should return a string with a message, type, and value when showValue is true", () => {
    expect(
      appendErrorSuffix("a test message", { value: input, showValue: true })
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
      appendErrorSuffix("a test message", { value: input, showValue: false })
    ).toMatchSnapshot();
  });

  it("should return a string with a message, type, and value when showValue is true", () => {
    expect(
      appendErrorSuffix("a test message", { value: input, showValue: true })
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
      appendErrorSuffix("a test message", { value: input, showValue: false })
    ).toMatchSnapshot();
  });

  it("should return a string with a message, type, and value when showValue is true", () => {
    expect(
      appendErrorSuffix("a test message", { value: input, showValue: true })
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
      appendErrorSuffix("a test message", { value: input, showValue: false })
    ).toMatchSnapshot();
  });

  it("should return a string with a message, type, and value when showValue is true", () => {
    expect(
      appendErrorSuffix("a test message", { value: input, showValue: true })
    ).toMatchSnapshot();
  });
});
