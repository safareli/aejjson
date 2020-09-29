import { Either } from "fp-ts/lib/Either";
import { unknown } from "io-ts";
import { Decoder, DecodeError } from "io-ts/lib/Decoder";

const vessels = require("./API/vessels.json");
const schedule_9303807 = require("./API/schedule/9303807.json");
const schedule_9314935 = require("./API/schedule/9314935.json");
const schedule_9335173 = require("./API/schedule/9335173.json");
const schedule_9337626 = require("./API/schedule/9337626.json");

const URL_Mapping: Record<string, unknown> = {
  "https://import-coding-challenge-api.portchain.com/api/v2/vessels": vessels,
  "https://import-coding-challenge-api.portchain.com/api/v2/schedule/9303807": schedule_9303807,
  "https://import-coding-challenge-api.portchain.com/api/v2/schedule/9314935": schedule_9314935,
  "https://import-coding-challenge-api.portchain.com/api/v2/schedule/9335173": schedule_9335173,
  "https://import-coding-challenge-api.portchain.com/api/v2/schedule/9337626": schedule_9337626,
};

export const mockAPIEnv = {
  get: async <T>(
    url: string,
    decoder: Decoder<unknown, T>
  ): Promise<Either<DecodeError, T>> =>
    new Promise((resolve, reject) => {
      if (URL_Mapping[url] === undefined) {
        reject(new Error("Unsupported URL:" + url));
      } else {
        resolve(decoder.decode(URL_Mapping[url]));
      }
    }),
};
