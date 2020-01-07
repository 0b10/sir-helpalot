/* eslint-disable jest/no-hooks */
import fc from 'fast-check';
import _ from 'lodash';
import { DEBUG_NODE_ENVS, PRODUCTION_NODE_ENVS, TEST_NODE_ENVS } from '../../constants';
import {
  isDebugEnv,
  isDevEnv,
  isNotDebugEnv,
  isNotDevEnv,
  isNotProductionEnv,
  isNotTestEnv,
  isProductionEnv,
  isTestEnv,
} from '../../predicates';

type Predicate = (forTesting?: any) => boolean;

interface Fixture {
  isMatchingEnv: Predicate;
  isNotMatchingEnv: Predicate;
  nodeEnvs: Set<string | undefined>;
  envType: 'debug' | 'testing' | 'production' | 'development';
  testForEmptyString?: boolean;
}

const testCases: Fixture[] = [
  {
    isMatchingEnv: isDebugEnv,
    isNotMatchingEnv: isNotDebugEnv,
    nodeEnvs: DEBUG_NODE_ENVS,
    envType: 'debug',
  },
  {
    isMatchingEnv: isTestEnv,
    isNotMatchingEnv: isNotTestEnv,
    nodeEnvs: TEST_NODE_ENVS,
    envType: 'testing',
  },
  {
    isMatchingEnv: isProductionEnv,
    isNotMatchingEnv: isNotProductionEnv,
    nodeEnvs: PRODUCTION_NODE_ENVS,
    envType: 'production',
    testForEmptyString: true,
  },
  {
    isMatchingEnv: isDevEnv,
    isNotMatchingEnv: isNotDevEnv,
    nodeEnvs: DEBUG_NODE_ENVS,
    envType: 'development',
  },
];

testCases.forEach(({ isMatchingEnv, isNotMatchingEnv, nodeEnvs, envType, testForEmptyString }) => {
  describe(isMatchingEnv.name, () => {
    it('should exist', () => {
      expect(isMatchingEnv).toBeDefined();
    });

    it(`should return true for any ${envType} env value`, () => {
      nodeEnvs.forEach((fakeNodeEnv) => {
        expect(
          isMatchingEnv({ nodeEnv: fakeNodeEnv }),
          `failed for fakeNodeEnv === ${fakeNodeEnv}`
        ).toBe(true);
      });
    });

    it(`should return false for any non-${envType} env value`, () => {
      fc.assert(
        fc.property(fc.string(), (fakeNodeEnv) => {
          fc.pre(!nodeEnvs.has(fakeNodeEnv)); // some envs can be empty string, so ensure it isn't a valid value
          return isMatchingEnv({ nodeEnv: fakeNodeEnv }) === false;
        }),
        { verbose: true }
      );
    });

    it(`should return false for any random "non-string" type value`, () => {
      fc.assert(
        fc.property(fc.anything(), (fakeNodeEnv) => {
          // ignore undefined, because it will default to using the real NODE_ENV
          fc.pre(
            !_.isUndefined({ nodeEnv: fakeNodeEnv }) &&
              typeof fakeNodeEnv !== 'string' &&
              !nodeEnvs.has(fakeNodeEnv as string)
          );
          return isMatchingEnv({ nodeEnv: fakeNodeEnv }) === false;
        }),
        { verbose: true }
      );
    });
  });

  describe(isNotMatchingEnv.name, () => {
    it('should exist', () => {
      expect(isNotMatchingEnv).toBeDefined();
    });

    it(`should negate ${isMatchingEnv.name}`, () => {
      nodeEnvs.forEach((fakeNodeEnv) => {
        expect(
          isNotMatchingEnv({ nodeEnv: fakeNodeEnv }),
          `failed for fakeNodeEnv === ${fakeNodeEnv}`
        ).toBe(!isMatchingEnv({ nodeEnv: fakeNodeEnv }));
      });
    });

    it(`should return true for any non-${envType} env values`, () => {
      fc.assert(
        fc.property(fc.string(), (fakeNodeEnv) => {
          fc.pre(!nodeEnvs.has(fakeNodeEnv)); // some envs can be empty string, so ensure it isn't a valid value
          return isNotMatchingEnv({ nodeEnv: fakeNodeEnv }) === true;
        }),
        { verbose: true }
      );
    });

    it(`should return true for any random "non-string" type value`, () => {
      // because they are not debug envs
      fc.assert(
        fc.property(fc.anything(), (fakeNodeEnv) => {
          // ignore undefined, because it will default to using the real NODE_ENV
          fc.pre(
            !_.isUndefined(fakeNodeEnv) &&
              typeof fakeNodeEnv !== 'string' &&
              !nodeEnvs.has(fakeNodeEnv as string)
          );
          isNotMatchingEnv({ nodeEnv: fakeNodeEnv }) === true;
        }),
        { verbose: true }
      );
    });
  });
});
