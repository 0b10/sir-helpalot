/* eslint-disable jest/no-hooks */
import fc from "fast-check";
import _ from "lodash";

import { DEV_NODE_ENVS } from "../../constants";
import { isDevEnv, isNotDevEnv } from "../../predicates";

describe("isDevEnv()", () => {
  it("should exist", () => {
    expect(isDevEnv).toBeDefined();
  });

  // >>> POSITIVE >>>
  DEV_NODE_ENVS.forEach((input) => {
    describe(`for a "development" NODE_ENV value`, () => {
      // const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

      // beforeEach(() => {
      //   process.env.NODE_ENV = input;
      // });

      // afterAll(() => {
      //   process.env.NODE_ENV = ORIGINAL_NODE_ENV;
      // });

      it(`should return true for NODE_ENV=${input}`, () => {
        expect(isDevEnv(input)).toBe(true);
        expect(isNotDevEnv(input)).toBe(!isDevEnv(input));
      });
    });
  });

  // >>> NEGATIVE >>>
  describe(`for any non-development NODE_ENV value`, () => {
    // const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

    // afterAll(() => {
    //   process.env.NODE_ENV = ORIGINAL_NODE_ENV;
    // });

    it(`should return false for any random string`, () => {
      fc.assert(
        fc.property(fc.string(), (input) => {
          return isDevEnv(input) === false && isNotDevEnv(input) === !isDevEnv(input);
        }),
        { verbose: true }
      );
    });

    // >>> FUZZ >>>
    it(`should return false for any random "non-string" type value`, () => {
      fc.assert(
        fc.property(fc.anything(), (input) => {
          // ignore undefined, because it will default to using the real NODE_ENV
          fc.pre(
            !_.isUndefined(input) &&
              typeof input !== "string" &&
              !DEV_NODE_ENVS.has(input as string)
          );
          return isDevEnv(input) === false && isNotDevEnv(input) === !isDevEnv(input);
        }),
        { verbose: true }
      );
    });
  });
});
