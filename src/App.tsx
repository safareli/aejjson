import * as React from "react";

import * as Env from "./env";
import {
  formatPercentile,
  formatMsDuration,
  loadAndAnalyzeData,
} from "./analyze";
import { useAsync } from "./lib/useAsync";

export const App = () => {
  const env = React.useContext(Env.Context);
  const load = React.useCallback(() => loadAndAnalyzeData(env), [env]);
  const res = useAsync(load, [load]);
  switch (res.type) {
    case "loading":
      return (
        <div className="App">
          <div className="App-loading">Loading ...</div>
        </div>
      );
    case "failed":
      return (
        <div className="App">
          <div className="App-error">
            Got Error:
            <br />
            <pre>
              {res.error.name}
              {res.error.message}
              {res.error.stack}
            </pre>
          </div>
        </div>
      );
    case "loaded":
      const data = res.result;
      return (
        <div className="App">
          <div className="App-Section">
            <h3>Ports with arrival percentiles</h3>
            <ul>
              {data.ports.map((d, idx) => (
                <li key={d.port.id}>
                  {`${d.port.name} (${d.port.id})`}
                  <ul>
                    {d.percentiles.map((p) => (
                      <li key={p.percentile}>
                        {formatPercentile(formatMsDuration)(p)}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
          <div className="App-Section">
            <h3>Vessels with delay percentiles</h3>
            <ul>
              {data.vessels.map((d) => (
                <li key={d.vessel.imo}>
                  {`${d.vessel.name} (${d.vessel.imo})`}
                  <ul>
                    {d.delays.map(({ day, percentiles }) => (
                      <li key={day}>
                        {day}th day
                        <ul>
                          {percentiles.map((p) => (
                            <li key={p.percentile}>
                              {formatPercentile(formatMsDuration)(p)}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
          <div className="App-Section">
            <h3>Top 5 ports by arrival</h3>
            <ul>
              {data.top5PortByCount.map((d, idx) => (
                <li
                  key={d.port.id}
                >{`${d.port.name} (${d.port.id}) ${d.count}`}</li>
              ))}
            </ul>
            <h3>Bottom 5 ports by arrival</h3>
            <ul>
              {data.bottom5PortByCount.map((d) => (
                <li
                  key={d.port.id}
                >{`${d.port.name} (${d.port.id}) ${d.count}`}</li>
              ))}
            </ul>
          </div>
        </div>
      );
  }
};
