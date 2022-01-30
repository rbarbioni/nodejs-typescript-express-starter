import AppError from "../errors";

export function fooSuccess() {
  return true;
}

export function fooError(body: any) {
  throw new AppError("FooError", body);
}
