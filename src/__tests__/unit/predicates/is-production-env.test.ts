/* eslint-disable jest/no-hooks */
import fc from "fast-check";

import { FAST_CHECK_OPTIONS } from "../../config";
import { isNotProductionEnv, isProductionEnv } from "../../../predicates";
import { PRODUCTION_NODE_ENVS } from "../../../constants";

describe("isProductionEnv()", () => {
  it("should exist", () => {
    expect(isProductionEnv).toBeDefined();
  });

  // >>> POSITIVE >>>
  PRODUCTION_NODE_ENVS.forEach((TEMP_NODE_ENV) => {
    describe(`for a "production" NODE_ENV value`, () => {
      const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

      beforeEach(() => {
        process.env.NODE_ENV = TEMP_NODE_ENV;
      });

      afterAll(() => {
        process.env.NODE_ENV = ORIGINAL_NODE_ENV;
      });

      it(`should return true for NODE_ENV=${TEMP_NODE_ENV}`, () => {
        expect(isProductionEnv()).toBe(true);
        expect(isNotProductionEnv()).toBe(!isProductionEnv());
      });
    });
  });

  // >>> NEGATIVE >>>
  describe(`for any non-production NODE_ENV value`, () => {
    const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

    afterAll(() => {
      process.env.NODE_ENV = ORIGINAL_NODE_ENV;
    });

    it(`should return false for any random ascii string`, () => {
      fc.assert(
        fc.property(fc.asciiString(), (nodeEnv) => {
          fc.pre(nodeEnv !== ""); // "", e.g. no env set, is also production
          process.env.NODE_ENV = nodeEnv;
          return isProductionEnv() === false && isNotProductionEnv() === !isProductionEnv();
        })
      ),
        FAST_CHECK_OPTIONS;
    });

    // >>> FUZZ >>>
    it(`should return false for any random "non-string" type value`, () => {
      fc.assert(
        fc.property(fc.anything(), (nodeEnv) => {
          fc.pre(typeof nodeEnv !== "string" && !PRODUCTION_NODE_ENVS.includes(nodeEnv));
          fc.pre(`${nodeEnv}` !== ""); // some types are empty strings when toString(), avoid those
          process.env.NODE_ENV = nodeEnv;
          return isProductionEnv() === false && isNotProductionEnv() === !isProductionEnv();
        })
      ),
        FAST_CHECK_OPTIONS;
    });
  });
});
