import { Either, isLeft } from "fp-ts/lib/Either";

export const assertRight = <E, V>(
  value: Either<E, V>,
  msg?: string | ((error: E) => string)
): V => {
  if (isLeft(value)) {
    const message =
      msg == null ? "" : typeof msg === "string" ? msg : msg(value.left);
    console.log(message);
    throw new Error("Assertion failed; " + message);
  }
  return value.right;
};
