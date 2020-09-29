import { pipe } from "fp-ts/lib/function";
import * as D from "io-ts/Decoder";

export type Vessel = D.TypeOf<typeof Vessel>;
export type Port = D.TypeOf<typeof Port>;
export type PortCall = D.TypeOf<typeof PortCall>;
export type Schedule = D.TypeOf<typeof Schedule>;
export type LogEntryDeparture = D.TypeOf<typeof LogEntryDeparture>;
export type LogEntryArrival = D.TypeOf<typeof LogEntryArrival>;
export type LogEntryIsOmitted = D.TypeOf<typeof LogEntryIsOmitted>;
export type LogEntry = D.TypeOf<typeof LogEntry>;

export const Vessel = D.type({
  name: D.string,
  imo: D.number,
});

export const Vessels = D.array(Vessel);

export const Port = D.type({ id: D.string, name: D.string });

export const DateFromISOString: D.Decoder<string, Date> = {
  decode: (s: string) => {
    const d = new Date(s);
    return isNaN(d.getTime()) ? D.failure(s, "ISODateString") : D.success(d);
  },
};

export const DateTime = pipe(D.string, D.compose(DateFromISOString));

export const LogEntryDeparture = D.type({
  updatedField: D.literal("departure"),
  departure: DateTime,
  createdDate: DateTime,
});

export const LogEntryArrival = D.type({
  updatedField: D.literal("arrival"),
  arrival: DateTime,
  createdDate: DateTime,
});

export const LogEntryIsOmitted = D.type({
  updatedField: D.literal("isOmitted"),
  isOmitted: D.boolean,
  createdDate: DateTime,
});

export const LogEntry = D.sum("updatedField")({
  departure: LogEntryDeparture,
  arrival: LogEntryArrival,
  isOmitted: LogEntryIsOmitted,
});

export const PortCall = D.type({
  arrival: DateTime,
  departure: DateTime,
  createdDate: DateTime,
  isOmitted: D.boolean,
  service: D.string,
  port: Port,
  logEntries: D.array(LogEntry),
});

export const Schedule = D.type({
  vessel: Vessel,
  portCalls: D.array(PortCall),
});
