/* eslint-disable jest/no-hooks */
import fc from "fast-check";

import { FAST_CHECK_OPTIONS } from "../../config";
import { isStrictInt, isNotStrictInt } from "../../../predicates";

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
        FAST_CHECK_OPTIONS;
    });
  });

  describe("fuzz", () => {
    it("should return false for random non-integer values", () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          fc.pre(!/^-?\d+/.test(value)); // not a digit
          return isStrictInt(value) === false && isNotStrictInt(value) === !isStrictInt(value);
        })
      ),
        FAST_CHECK_OPTIONS;
    });
  });
});
