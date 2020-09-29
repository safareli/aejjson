import { Either } from "fp-ts/lib/Either";
import * as D from "io-ts/Decoder";

export type GET = typeof get;
export const get = async <T>(
  url: string,
  decoder: D.Decoder<unknown, T>
): Promise<Either<D.DecodeError, T>> => {
  return window
    .fetch(url)
    .then((res) => res.json())
    .then((json) => decoder.decode(json));
};
