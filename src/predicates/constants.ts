export const DEV_NODE_ENVS = new Set([
  'dev',
  'develop',
  'development',
  'debug',
  'trace',
  'test',
  'testing',
]);

export const TEST_NODE_ENVS = new Set(['test', 'testing']);

export const DEBUG_NODE_ENVS = new Set(['debug', 'trace']);

export const PRODUCTION_NODE_ENVS = new Set(['', undefined, 'production', 'prod']);

export const RE_STRICT_INT = /^-?\d+$/;
