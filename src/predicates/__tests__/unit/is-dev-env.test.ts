/* eslint-disable jest/no-hooks */
import fc from "fast-check";

import { DEV_NODE_ENVS } from "../../constants";
import { FAST_CHECK_OPTIONS } from "../../../__tests__/config";
import { isDevEnv, isNotDevEnv } from "../../predicates";

describe("isDevEnv()", () => {
  it("should exist", () => {
    expect(isDevEnv).toBeDefined();
  });

  // >>> POSITIVE >>>
  DEV_NODE_ENVS.forEach((TEMP_NODE_ENV) => {
    describe(`for a "development" NODE_ENV value`, () => {
      const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

      beforeEach(() => {
        process.env.NODE_ENV = TEMP_NODE_ENV;
      });

      afterAll(() => {
        process.env.NODE_ENV = ORIGINAL_NODE_ENV;
      });

      it(`should return true for NODE_ENV=${TEMP_NODE_ENV}`, () => {
        expect(isDevEnv()).toBe(true);
        expect(isNotDevEnv()).toBe(!isDevEnv());
      });
    });
  });

  // >>> NEGATIVE >>>
  describe(`for any non-development NODE_ENV value`, () => {
    const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

    afterAll(() => {
      process.env.NODE_ENV = ORIGINAL_NODE_ENV;
    });

    it(`should return false for any random ascii string`, () => {
      fc.assert(
        fc.property(fc.asciiString(), (nodeEnv) => {
          process.env.NODE_ENV = nodeEnv;
          return isDevEnv() === false && isNotDevEnv() === !isDevEnv();
        })
      ),
        FAST_CHECK_OPTIONS;
    });

    // >>> FUZZ >>>
    it(`should return false for any random "non-string" type value`, () => {
      fc.assert(
        fc.property(fc.anything(), (nodeEnv) => {
          fc.pre(typeof nodeEnv !== "string" && !DEV_NODE_ENVS.includes(nodeEnv));
          process.env.NODE_ENV = nodeEnv;
          return isDevEnv() === false && isNotDevEnv() === !isDevEnv();
        })
      ),
        FAST_CHECK_OPTIONS;
    });
  });
});
