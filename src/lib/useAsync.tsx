import { useEffect, useState } from "react";

export type Async<T> =
  | { type: "loading" }
  | { type: "failed"; error: Error }
  | { type: "loaded"; result: T };

export function useAsync<T>(fn: () => Promise<T>, deps: any[]) {
  const [res, setRes] = useState<Async<T>>({ type: "loading" });
  useEffect(() => {
    let cancel = false;
    fn().then(
      (result) => {
        if (cancel) return;
        setRes({ type: "loaded", result });
      },
      (error) => {
        if (cancel) return;
        setRes({ type: "failed", error });
      }
    );
    return () => {
      cancel = true;
    };
  }, deps);
  return res;
}
