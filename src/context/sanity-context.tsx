import React, { PropsWithChildren } from "react";
import {
  SanityFaktum,
  SanityLandGruppe,
  SanitySeksjon,
  SanityStartSideTekst,
  SanitySvaralternativ,
  SanityTexts,
} from "../types/sanity.types";
import * as SentryLogger from "../sentry.logger";

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

  function getSeksjonTextById(textId: string): SanitySeksjon | undefined {
    const text = context?.seksjoner.find((seksjon) => seksjon.textId === textId);
    if (!text) {
      SentryLogger.logMissingSanityText(textId);
    }
    return text;
  }

  function getFaktumTextById(textId: string): SanityFaktum | undefined {
    const text = context?.fakta.find((faktum) => faktum.textId === textId);
    if (!text) {
      SentryLogger.logMissingSanityText(textId);
    }
    return text;
  }

  function getLandGruppeTextById(textId: string | undefined): SanityLandGruppe | undefined {
    const text = context?.landgrupper.find((gruppe) => gruppe.textId === textId);
    if (textId && !text) {
      SentryLogger.logMissingSanityText(textId);
    }
    return text;
  }

  function getSvaralternativTextById(textId: string): SanitySvaralternativ | undefined {
    const text = context?.svaralternativer.find(
      (svaralternativ) => svaralternativ.textId === textId
    );
    if (!text) {
      SentryLogger.logMissingSanityText(textId);
    }
    return text;
  }

  function getAppTekst(textId: string): string {
    const text =
      context?.apptekster.find((apptekst) => apptekst.textId === textId)?.valueText || textId;
    if (!text) {
      SentryLogger.logMissingSanityText(textId);
    }
    return text;
  }

  function getStartsideText(): SanityStartSideTekst | undefined {
    return context?.startside[0];
  }

  return {
    getSeksjonTextById,
    getFaktumTextById,
    getLandGruppeTextById,
    getSvaralternativTextById,
    getAppTekst,
    getStartsideText,
  };
}

export { SanityProvider, useSanity };
