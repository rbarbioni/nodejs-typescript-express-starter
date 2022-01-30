import AppError from "../errors";

export async function fooSuccess() {
  return true;
}

export async function fooError(body: any) {
  throw new AppError("FooError", body);
}
