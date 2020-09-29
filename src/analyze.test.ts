import {
  loadAndAnalyzeData,
  formatPercentile,
  toPercentiles,
  formatMsDuration,
} from "./analyze";

import { mockAPIEnv } from "./__mock__/api";

it("formatMsDuration", () => {
  expect(formatMsDuration(0)).toBe("0 second");
  expect(formatMsDuration(123)).toBe("0 second");
  expect(formatMsDuration(1000)).toBe("1 second");
  expect(formatMsDuration(10000)).toBe("10 seconds");
  expect(formatMsDuration(100000)).toBe("1 minute 40 seconds");
  expect(formatMsDuration(10000000)).toBe("2 hours 46 minutes 40 seconds");
});

it("toPercentiles & formatPercentile", () => {
  const p = toPercentiles([10, 50, 60, 100], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  expect(toPercentiles([10, 50, 60, 100], [])).toEqual([]);
  expect(toPercentiles([], [1, 2])).toEqual([]);
  expect(p).toEqual([
    { percentile: 10, value: 1 },
    { percentile: 50, value: 5 },
    { percentile: 60, value: 6 },
    { percentile: 100, value: 10 },
  ]);
  expect(p.map(formatPercentile((x) => `${x}`))).toEqual([
    "10th% 1",
    "50th% 5",
    "60th% 6",
    "100th% 10",
  ]);
});

it("loadAndAnalyzeData works", async () => {
  expect(await loadAndAnalyzeData(mockAPIEnv)).toMatchSnapshot();
});
