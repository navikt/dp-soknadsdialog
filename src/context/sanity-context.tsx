import React, { PropsWithChildren } from "react";
import {
  SanityFaktum,
  SanityLandGruppe,
  SanitySvaralternativ,
  SanityTexts,
} from "../types/sanity.types";

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

  function getFaktumTextById(textId: string): SanityFaktum | undefined {
    return context?.fakta.find((faktum) => faktum.textId === textId);
  }

  function getLandGruppeTextById(textId: string | undefined): SanityLandGruppe | undefined {
    return context?.landgrupper.find((gruppe) => gruppe.textId === textId);
  }

  function getSvaralternativTextById(textId: string): SanitySvaralternativ | undefined {
    return context?.svaralternativer.find((svaralternativ) => svaralternativ.textId === textId);
  }

  return {
    getFaktumTextById,
    getLandGruppeTextById,
    getSvaralternativTextById,
  };
}

export { SanityProvider, useSanity };
