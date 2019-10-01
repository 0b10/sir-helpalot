export class SirHelpalotError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SirHelpalotError";
  }
}
