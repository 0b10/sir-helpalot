/* eslint-disable jest/no-hooks */
import fc from "fast-check";

import { FAST_CHECK_OPTIONS } from "../../config";
import { isStrictInteger, isNotStrictInteger } from "../../../predicates";

describe("isStrictInteger()", () => {
  it("should exist", () => {
    expect(isStrictInteger).toBeDefined();
    expect(isNotStrictInteger).toBeDefined();
  });

  describe("positive", () => {
    it("should return true for random integer values", () => {
      fc.assert(
        fc.property(fc.integer(), (value) => {
          return (
            isStrictInteger(value) === true && isNotStrictInteger(value) === !isStrictInteger(value)
          );
        })
      ),
        FAST_CHECK_OPTIONS;
    });
  });

  describe("fuzz", () => {
    it("should return false for random non-integer values", () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          fc.pre(!/^-?\d+/.test(value)); // not a digit
          return (
            isStrictInteger(value) === false &&
            isNotStrictInteger(value) === !isStrictInteger(value)
          );
        })
      ),
        FAST_CHECK_OPTIONS;
    });
  });
});
