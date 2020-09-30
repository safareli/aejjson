import * as React from "react";
import ReactDOM from "react-dom";
import * as Env from "./Env";
import { App } from "./App";

ReactDOM.render(
  <Env.Provider value={Env.realEnv}>
    <App />
  </Env.Provider>,
  document.getElementById("app")
);
