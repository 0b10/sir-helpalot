import { ErrorOptions } from "./error";
export declare class SirHelpalotError extends Error {
    constructor(message: string, options?: ErrorOptions);
}
export declare class SirHelpalotPreconditionError extends Error {
    constructor(message: string, options?: ErrorOptions);
}
