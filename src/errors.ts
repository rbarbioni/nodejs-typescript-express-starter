export default class AppError extends Error {
  public extras?: unknown;

  constructor(msg: string, extras?: unknown) {
    super(msg);
    this.extras = extras;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
