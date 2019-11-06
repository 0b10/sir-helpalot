import fc from "fast-check";

import { isStrictInt, isNotStrictInt } from "../../predicates";

describe("isStrictInt()", () => {
  it("should exist", () => {
    expect(isStrictInt).toBeDefined();
    expect(isNotStrictInt).toBeDefined();
  });

  describe("positive", () => {
    it("should return true for random integer values", () => {
      fc.assert(
        fc.property(fc.integer(), (value) => {
          return isStrictInt(value) === true && isNotStrictInt(value) === !isStrictInt(value);
        })
      ),
        { verbose: true };
    });
  });

  describe("negative", () => {
    it("should return false for digit strings - i.e. not strict number type", () => {
      fc.assert(
        fc.property(fc.maxSafeInteger(), (value) => {
          const digitString = `${value}`;
          return (
            isStrictInt(digitString) === false &&
            isNotStrictInt(digitString) === !isStrictInt(digitString)
          );
        })
      ),
        { verbose: true };
    });
  });

  describe("fuzz", () => {
    it("should return false for random non-integer values", () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          fc.pre(!/^-?\d+/.test(value as string)); // not a digit
          return isStrictInt(value) === false && isNotStrictInt(value) === !isStrictInt(value);
        })
      ),
        { verbose: true };
    });
  });
});
