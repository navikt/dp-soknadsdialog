import { useEffect, useState } from "react";

interface IUseForceTrigger {
  forceTrigger: () => void;
  trigger: boolean;
}

export function useForceTrigger(): IUseForceTrigger {
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTrigger(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [trigger]);

  function forceTrigger() {
    setTrigger(true);
  }

  return {
    forceTrigger,
    trigger,
  };
}
