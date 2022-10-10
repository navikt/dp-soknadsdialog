import { RefObject } from "react";

interface IUseScrollTo {
  scrollTo: (ref: RefObject<HTMLDivElement>) => void;
}

export function useScrollTo(): IUseScrollTo {
  function scrollTo(ref: RefObject<HTMLElement>) {
    ref.current?.focus();
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return {
    scrollTo,
  };
}
