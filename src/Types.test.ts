import { draw } from "io-ts/lib/Decoder";
import { assertRight } from "./lib/assert";
import { PortCall, Vessel } from "./Types";

it("decode", () => {
  const vessel: unknown = { imo: 9303807, name: "ABIDJAN EXPRESS" };
  const portCall: unknown = {
    arrival: "2018-12-28T23:12:00+00:00",
    departure: "2019-01-05T07:03:00+00:00",
    createdDate: "2019-01-16T09:04:49.048105+00:00",
    isOmitted: false,
    service: "Pacific South Loop 1",
    port: {
      id: "USLAX",
      name: "Los Angeles",
    },
    logEntries: [
      {
        updatedField: "arrival",
        arrival: "2018-12-28T23:12:00+00:00",
        departure: null,
        isOmitted: null,
        createdDate: "2019-01-16T09:04:49.048105+00:00",
      },
      {
        updatedField: "departure",
        arrival: null,
        departure: "2019-01-05T07:03:00+00:00",
        isOmitted: null,
        createdDate: "2019-01-16T09:04:49.048105+00:00",
      },
    ],
  };

  const vesselDecoded = assertRight(Vessel.decode(vessel), draw);
  const portCallDecoded = assertRight(PortCall.decode(portCall), draw);
  expect(vesselDecoded).toMatchSnapshot();
  expect(portCallDecoded).toMatchSnapshot();
});
