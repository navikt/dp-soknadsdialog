import React, { PropsWithChildren } from "react";
import { SanityTexts } from "../types/sanity.types";

export const SanityContext = React.createContext<SanityTexts | undefined>(undefined);

interface Props {
  initialState: SanityTexts;
}

function SanityProvider(props: PropsWithChildren<Props>) {
  return (
    <SanityContext.Provider value={props.initialState}>{props.children}</SanityContext.Provider>
  );
}

function useSanity() {
  const context = React.useContext(SanityContext);
  if (context === undefined) {
    throw new Error("useSanity must be used within a SanityProvider");
  }
  return context;
}

export { SanityProvider, useSanity };
