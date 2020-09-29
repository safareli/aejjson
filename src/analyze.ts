import * as DF from "date-fns";
import * as Types from "./Types";
import { zipWith } from "fp-ts/lib/Array";
import calcPercentiles from "percentile";
import { APIEnv } from "./API";
import * as API from "./API";
const MS_IN_A_DAY = 1000 * 60 * 60 * 24;
import { takeLeft, takeRight, reverse } from "fp-ts/lib/Array";

export type VesselWithMeta = {
  vessel: Types.Vessel;
  delays: {
    day: number;
    percentiles: Percentile[];
  }[];
};

export const analyzeVessel = (
  schedules: Types.Schedule[],
  daysBeforeArrivalList: number[],
  dayPercentiles: number[]
): VesselWithMeta[] => {
  return schedules.map((s) => {
    const delays = new Map<number, number[]>();
    daysBeforeArrivalList.forEach((daysBeforeArrival) => {
      delays.set(daysBeforeArrival, []);
    });
    s.portCalls.forEach((portCall) => {
      if (portCall.isOmitted) {
        return;
      }
      const actualArrival = portCall.arrival;
      portCall.logEntries.forEach((arrival) => {
        if (arrival.updatedField !== "arrival") {
          return;
        }
        const delay = Math.abs(
          arrival.arrival.getTime() - actualArrival.getTime()
        );
        const daysUntilArrival =
          (actualArrival.getTime() - arrival.createdDate.getTime()) /
          MS_IN_A_DAY;

        for (let daysBeforeArrival of daysBeforeArrivalList) {
          if (daysUntilArrival >= daysBeforeArrival) {
            delays.get(daysBeforeArrival)!.push(delay);
            break;
          }
        }
      });
    });

    return {
      vessel: s.vessel,
      delays: [...delays.entries()].map(([day, delay]) => ({
        day,
        percentiles: toPercentiles(dayPercentiles, delay),
      })),
    };
  });
};

export type PortWithMeta = {
  port: Types.Port;
  count: number;
  durations: number[];
  percentiles: Percentile[];
};

export const analyzePorts = (
  schedules: Types.Schedule[],
  durationPercentiles: number[]
): PortWithMeta[] => {
  const portIdToData = new Map<
    string,
    { port: Types.Port; durations: number[] }
  >();
  schedules.forEach((schedule) =>
    schedule.portCalls.forEach((portCall) => {
      if (portCall.isOmitted) {
        return;
      }
      const portId = portCall.port.id;
      const data = portIdToData.get(portId);
      const duration =
        portCall.departure.getTime() - portCall.arrival.getTime();
      if (data === undefined) {
        portIdToData.set(portId, {
          port: portCall.port,
          durations: [duration],
        });
      } else {
        data.durations.push(duration);
      }
    })
  );

  return [...portIdToData.values()]
    .map(({ durations, port }) => ({
      port,
      count: durations.length,
      durations,
      percentiles: toPercentiles(durationPercentiles, durations),
    }))
    .sort((a, b) => a.count - b.count);
};

export type Percentile = { percentile: number; value: number };

export const toPercentiles = (
  percentiles: number[],
  data: number[]
): Percentile[] => {
  const percentilesRes = (calcPercentiles(
    percentiles,
    data
  ) as number[]).filter((x: number) => x !== undefined);
  return zipWith(percentiles, percentilesRes, (percentile, value) => ({
    percentile,
    value,
  }));
};

export const formatPercentile = (fn: (value: number) => string) => ({
  percentile,
  value,
}: Percentile) => {
  return `${percentile}th% ${fn(value)}`;
};

export const formatMsDuration = (ms: number) =>
  ms < 1000
    ? "0 second"
    : DF.formatDuration(
        DF.intervalToDuration({
          start: new Date(0),
          end: new Date(ms),
        })
      );

export const loadAndAnalyzeData = async (env: APIEnv) => {
  const schedules = await API.getAllSchedules(env);
  const ports = analyzePorts(
    schedules,
    // duration percentiles
    [5, 20, 50, 75, 90]
  );

  const vessels = analyzeVessel(
    schedules,
    // days
    [14, 7, 2],
    // day percentiles
    [5, 50, 80]
  );
  const bottom5PortByCount = takeLeft(5)(ports);
  const top5PortByCount = reverse(takeRight(5)(ports));
  return { ports, bottom5PortByCount, top5PortByCount, vessels };
};
