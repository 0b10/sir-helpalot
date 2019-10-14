/* eslint-disable jest/no-hooks */
import fc from "fast-check";

import { FAST_CHECK_OPTIONS } from "../../config";
import { isSafeStrictInteger, isNotSafeStrictInteger } from "../../../predicates";

describe("isSafeStrictInteger()", () => {
  it("should exist", () => {
    expect(isSafeStrictInteger).toBeDefined();
    expect(isNotSafeStrictInteger).toBeDefined();
  });

  // >>> POSITIVE >>>
  describe("positive", () => {
    it("should return true for random integer values", () => {
      fc.assert(
        fc.property(fc.maxSafeInteger(), (value) => {
          return (
            isSafeStrictInteger(value) === true &&
            isNotSafeStrictInteger(value) === !isSafeStrictInteger(value)
          );
        })
      ),
        FAST_CHECK_OPTIONS;
    });

    it("should return true for values just of the inside upper boundary", () => {
      const max = Number.MAX_SAFE_INTEGER;
      for (let val of [max, max - 1, max - 2]) {
        expect(isSafeStrictInteger(val) && !isNotSafeStrictInteger(val)).toBe(true);
      }
    });

    it("should return true for values just inside of the lower boundary", () => {
      const min = Number.MIN_SAFE_INTEGER;
      for (let val of [min, min + 1, min + 2]) {
        expect(isSafeStrictInteger(val) && !isNotSafeStrictInteger(val)).toBe(true);
      }
    });
  });

  // >>> NEGATIVE >>>
  describe("negative", () => {
    it("should return false for integers > MAX_SAFE_INTEGER", () => {
      fc.assert(
        fc.property(
          fc.integer(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER + 1000),
          (value) => {
            fc.pre(value > Number.MAX_SAFE_INTEGER); // unsafe, so quirky - sits on boundary sometimes
            return (
              isSafeStrictInteger(value) === false &&
              isNotSafeStrictInteger(value) === !isSafeStrictInteger(value)
            );
          }
        )
      ),
        FAST_CHECK_OPTIONS;
    });

    it("should return false for integers < MIN_SAFE_INTEGER", () => {
      fc.assert(
        fc.property(
          fc.integer(Number.MIN_SAFE_INTEGER - 1000, Number.MIN_SAFE_INTEGER - 1),
          (value) => {
            fc.pre(value < Number.MIN_SAFE_INTEGER); // unsafe, so quirky - sits on boundary sometimes
            return (
              isSafeStrictInteger(value) === false &&
              isNotSafeStrictInteger(value) === !isSafeStrictInteger(value)
            );
          }
        )
      ),
        FAST_CHECK_OPTIONS;
    });

    // These boundary tests are risky, because they go beyond safe limits. You might need to adapt them
    it("should return false for values just outside of the upper boundary", () => {
      const max = Number.MAX_SAFE_INTEGER;
      for (let val of [max + 1, max + 2, max + 3]) {
        expect(isSafeStrictInteger(val) && !isNotSafeStrictInteger(val)).toBe(false);
      }
    });

    it("should return false for values just outside of the lower boundary", () => {
      const min = Number.MIN_SAFE_INTEGER;
      for (let val of [min - 1, min - 2, min - 3]) {
        expect(isSafeStrictInteger(val) && !isNotSafeStrictInteger(val)).toBe(false);
      }
    });
  });

  // >>> FUZZ >>>
  describe("fuzz", () => {
    it("should return false for random non-integer values", () => {
      fc.assert(
        fc.property(fc.anything(), (value) => {
          fc.pre(!/^-?\d+/.test(value)); // not a digit
          return (
            isSafeStrictInteger(value) === false &&
            isNotSafeStrictInteger(value) === !isSafeStrictInteger(value)
          );
        })
      ),
        FAST_CHECK_OPTIONS;
    });
  });
});
