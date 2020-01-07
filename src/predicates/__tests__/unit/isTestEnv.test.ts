/* eslint-disable jest/no-hooks */
import fc from 'fast-check';
import _ from 'lodash';
import { isNotTestEnv, isTestEnv } from '../..';
import { TEST_NODE_ENVS } from '../../constants';

describe('isTestEnv()', () => {
  it('should exist', () => {
    expect(isTestEnv).toBeDefined();
  });

  // >>> POSITIVE >>>
  TEST_NODE_ENVS.forEach((fakeNodeEnv) => {
    describe(`for a "testing" NODE_ENV value`, () => {
      it(`should return true for NODE_ENV=${fakeNodeEnv}`, () => {
        expect(isTestEnv(fakeNodeEnv)).toBe(true);
        expect(isNotTestEnv(fakeNodeEnv)).toBe(!isTestEnv(fakeNodeEnv));
      });
    });
  });

  // >>> NEGATIVE >>>
  describe(`for any non-testing NODE_ENV value`, () => {
    it(`should return false for any random string`, () => {
      fc.assert(
        fc.property(fc.string(), (fakeNodeEnv) => {
          return (
            isTestEnv(fakeNodeEnv) === false &&
            isNotTestEnv(fakeNodeEnv) === !isTestEnv(fakeNodeEnv)
          );
        }),
        { verbose: true }
      );
    });

    // >>> FUZZ >>>
    it(`should return false for any random "non-string" type value`, () => {
      fc.assert(
        fc.property(fc.anything(), (fakeNodeEnv) => {
          // ignore undefined, because it will default to using the real NODE_ENV
          fc.pre(
            !_.isUndefined(fakeNodeEnv) &&
              typeof fakeNodeEnv !== 'string' &&
              !TEST_NODE_ENVS.has(fakeNodeEnv as string)
          );
          return (
            isTestEnv(fakeNodeEnv) === false &&
            isNotTestEnv(fakeNodeEnv) === !isTestEnv(fakeNodeEnv)
          );
        }),
        { verbose: true }
      );
    });
  });
});
