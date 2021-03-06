"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEV_NODE_ENVS = new Set([
    'dev',
    'develop',
    'development',
    'debug',
    'trace',
    'test',
    'testing',
]);
exports.TEST_NODE_ENVS = new Set(['test', 'testing']);
exports.DEBUG_NODE_ENVS = new Set(['debug', 'trace']);
exports.PRODUCTION_NODE_ENVS = new Set(['', undefined, 'production', 'prod']);
exports.RE_STRICT_INT = /^-?\d+$/;
