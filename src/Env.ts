import * as React from "react";
import * as HTTP from "./lib/HTTP";

export type Env = {
  get: HTTP.GET;
};

export const realEnv = { get: HTTP.get };

export const Context = React.createContext<Env>({
  get: () => new Promise(() => {}),
});

export const Provider = Context.Provider;
