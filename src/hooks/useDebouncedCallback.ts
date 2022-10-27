import debounce from "lodash/debounce";
import { useCallback } from "react";

interface IDebounce {
  cancel: () => void;
  flush: () => void;
}

export function useDebouncedCallback<T>(
  setter: (value: T) => void,
  delayMs: number,
  maxWaitMs?: number
): ((value: T) => void) & IDebounce {
  return useCallback(debounce(setter, delayMs, { maxWait: maxWaitMs ? maxWaitMs : 2000 }), [
    setter,
  ]);
}
