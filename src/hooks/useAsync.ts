import { useCallback, useEffect, useState } from "react";

type IAsyncStatus = "idle" | "pending" | "success" | "error";

export function useAsync<T>(asyncFunction: () => Promise<Response>, immediate = false) {
  const [status, setStatus] = useState<IAsyncStatus>("idle");
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<unknown | null>(null);

  function reset() {
    setValue(null);
    setError(null);
    setStatus("idle");
  }

  const execute = useCallback(async () => {
    setStatus("pending");
    setValue(null);
    setError(null);

    try {
      const response = await asyncFunction();

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      setStatus("success");
      setValue(await response.json());
    } catch (error) {
      setError(error);
      setStatus("error");
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error, reset };
}
