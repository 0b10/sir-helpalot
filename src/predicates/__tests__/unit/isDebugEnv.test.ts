/* eslint-disable jest/no-hooks */
import fc from 'fast-check';
import _ from 'lodash';
import { DEBUG_NODE_ENVS } from '../../constants';
import { isDebugEnv, isNotDebugEnv } from '../../predicates';

describe('isDebugEnv()', () => {
  it('should exist', () => {
    expect(isDebugEnv).toBeDefined();
  });

  it(`should return true for any deug env value`, () => {
    DEBUG_NODE_ENVS.forEach((fakeNodeEnv) => {
      expect(isDebugEnv(fakeNodeEnv)).toBe(true);
    });
  });

  it(`should return false for any non-debug env value`, () => {
    fc.assert(
      fc.property(fc.string(), (fakeNodeEnv) => {
        return (
          isDebugEnv(fakeNodeEnv) === false &&
          isNotDebugEnv(fakeNodeEnv) === !isDebugEnv(fakeNodeEnv)
        );
      }),
      { verbose: true }
    );
  });

  it(`should return false for any random "non-string" type value`, () => {
    fc.assert(
      fc.property(fc.anything(), (fakeNodeEnv) => {
        // ignore undefined, because it will default to using the real NODE_ENV
        fc.pre(
          !_.isUndefined(fakeNodeEnv) &&
            typeof fakeNodeEnv !== 'string' &&
            !DEBUG_NODE_ENVS.has(fakeNodeEnv as string)
        );
        return (
          isDebugEnv(fakeNodeEnv) === false &&
          isNotDebugEnv(fakeNodeEnv) === !isDebugEnv(fakeNodeEnv)
        );
      }),
      { verbose: true }
    );
  });
});

describe('isNotDebugEnv()', () => {
  it('should exist', () => {
    expect(isNotDebugEnv).toBeDefined();
  });

  it('should negate isDebugEnv()', () => {
    DEBUG_NODE_ENVS.forEach((fakeNodeEnv) => {
      expect(isNotDebugEnv(fakeNodeEnv)).toBe(!isDebugEnv(fakeNodeEnv));
    });
  });

  it(`should return true for any non-debug env values`, () => {
    fc.assert(
      fc.property(fc.string(), (fakeNodeEnv) => {
        return isNotDebugEnv(fakeNodeEnv) === true;
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
            !DEBUG_NODE_ENVS.has(fakeNodeEnv as string)
        );
        isNotDebugEnv(fakeNodeEnv) === true;
      }),
      { verbose: true }
    );
  });
});
