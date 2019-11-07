"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("./error");
class SirHelpalotError extends Error {
    constructor(message, options) {
        super(error_1.appendErrorSuffix(message, options));
        this.name = "SirHelpalotError";
    }
}
exports.SirHelpalotError = SirHelpalotError;
class SirHelpalotPreconditionError extends Error {
    constructor(message, options) {
        super(error_1.appendErrorSuffix(message, options));
        this.name = "SirHelpalotPreconditionError";
    }
}
exports.SirHelpalotPreconditionError = SirHelpalotPreconditionError;
