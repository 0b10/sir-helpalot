/* eslint-disable jest/no-hooks */
import fc from "fast-check";
import _ from "lodash";

import { isNotProductionEnv, isProductionEnv } from "../../predicates";
import { PRODUCTION_NODE_ENVS } from "../../constants";

describe("isProductionEnv()", () => {
  it("should exist", () => {
    expect(isProductionEnv).toBeDefined();
  });

  // >>> POSITIVE >>>
  PRODUCTION_NODE_ENVS.forEach((input) => {
    describe(`for a "production" NODE_ENV value`, () => {
      if (!_.isUndefined(input)) {
        // don't test undefined, because it falls back to the default value - the real NODE_ENV
        it(`should return true for NODE_ENV=${input}`, () => {
          expect(isProductionEnv(input)).toBe(true);
          expect(isNotProductionEnv(input)).toBe(!isProductionEnv(input));
        });
      }
    });
  });

  // >>> NEGATIVE >>>
  describe(`for any non-production NODE_ENV value`, () => {
    it(`should return false for any random ascii string`, () => {
      fc.assert(
        fc.property(fc.asciiString(), (input) => {
          fc.pre(input !== ""); // "", e.g. no env set, is also production
          process.env.NODE_ENV = input;
          return (
            isProductionEnv(input) === false &&
            isNotProductionEnv(input) === !isProductionEnv(input)
          );
        }),
        { verbose: true }
      );
    });

    // >>> FUZZ >>>
    it(`should return false for any random "non-string" type value`, () => {
      fc.assert(
        fc.property(fc.anything(), (input) => {
          fc.pre(typeof input !== "string" && !PRODUCTION_NODE_ENVS.has(input as string));
          fc.pre(`${input}` !== ""); // some types are empty strings when toString(), avoid those
          return (
            isProductionEnv(input) === false &&
            isNotProductionEnv(input) === !isProductionEnv(input)
          );
        }),
        { verbose: true }
      );
    });
  });
});
