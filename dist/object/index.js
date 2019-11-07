"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
/**
 * WARNING: Be very careful when using this function, do NOT allow any form of user input to be
 *  included into the "remove" array. This function uses object injection, see here for further
 *  reading: https://git.io/JeaRR
 *
 * Remove a list of keys from an object.
 *
 * @param {T} obj - any object
 * @param {string[]} remove - an array of keys to remove
 * @param {boolean} useClone - should the object be cloned first? The result will be a new object if
 *  so
 * @returns {object} An object of the same shape, minus the desired keys
 */
exports.removeKeys = (obj, remove, useClone = true) => {
    const target = useClone ? lodash_1.default.cloneDeep(obj) : obj;
    for (let k of remove) {
        delete target[k]; // eslint-disable-line security/detect-object-injection
    }
    return target;
};
