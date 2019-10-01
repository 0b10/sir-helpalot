export class SirHelpsalotError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SirHelpsalotError";
  }
}
