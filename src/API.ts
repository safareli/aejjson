import * as D from "io-ts/Decoder";
import * as Codec from "./Types";
import { assertRight } from "./lib/assert";
import * as HTTP from "./lib/HTTP";

export type APIEnv = { get: HTTP.GET };

const getAllVessels = async (env: APIEnv) => {
  const vessels = await env.get(
    "https://import-coding-challenge-api.portchain.com/api/v2/vessels",
    Codec.Vessels
  );
  return assertRight(vessels, D.draw);
};

export const getAllSchedules = async (env: APIEnv) => {
  const vessels = await getAllVessels(env);
  const schedules = (
    await Promise.all(
      vessels.map((v) =>
        env.get(
          `https://import-coding-challenge-api.portchain.com/api/v2/schedule/${v.imo}`,
          Codec.Schedule
        )
      )
    )
  ).map((x) => assertRight(x, D.draw));
  return schedules;
};
