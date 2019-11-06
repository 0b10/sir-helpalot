import { appendErrorSuffix, ErrorOptions } from "./error";

export class SirHelpalotError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(appendErrorSuffix(message, options));
    this.name = "SirHelpalotError";
  }
}

export class SirHelpalotPreconditionError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(appendErrorSuffix(message, options));
    this.name = "SirHelpalotPreconditionError";
  }
}
