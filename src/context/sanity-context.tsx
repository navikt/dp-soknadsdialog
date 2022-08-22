import React, { PropsWithChildren } from "react";
import {
  ISanityDokumentkrav,
  ISanityDokumentkravSvar,
  ISanityFaktum,
  ISanityLandGruppe,
  ISanitySeksjon,
  ISanityStartSideTekst,
  ISanitySvaralternativ,
  ISanityTexts,
} from "../types/sanity.types";
import * as SentryLogger from "../sentry.logger";

export const SanityContext = React.createContext<ISanityTexts | undefined>(undefined);

interface IProps {
  initialState: ISanityTexts;
}

function SanityProvider(props: PropsWithChildren<IProps>) {
  return (
    <SanityContext.Provider value={props.initialState}>{props.children}</SanityContext.Provider>
  );
}

function useSanity() {
  const context = React.useContext(SanityContext);
  if (context === undefined) {
    throw new Error("useSanity must be used within a SanityProvider");
  }

  function getSeksjonTextById(textId: string): ISanitySeksjon | undefined {
    const text = context?.seksjoner.find((seksjon) => seksjon.textId === textId);
    if (!text) {
      SentryLogger.logMissingSanityText(textId);
    }
    return text;
  }

  function getFaktumTextById(textId: string): ISanityFaktum | undefined {
    const text = context?.fakta.find((faktum) => faktum.textId === textId);
    if (!text) {
      SentryLogger.logMissingSanityText(textId);
    }
    return text;
  }

  function getLandGruppeTextById(textId: string | undefined): ISanityLandGruppe | undefined {
    const text = context?.landgrupper.find((gruppe) => gruppe.textId === textId);
    if (textId && !text) {
      SentryLogger.logMissingSanityText(textId);
    }
    return text;
  }

  function getSvaralternativTextById(textId: string): ISanitySvaralternativ | undefined {
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

  function getStartsideText(): ISanityStartSideTekst | undefined {
    return context?.startside[0];
  }

  function getDokumentkravTextById(textId: string): ISanityDokumentkrav | undefined {
    return context?.dokumentkrav.find((krav) => krav.textId === textId);
  }

  function getDokumentkravSvarTextById(textId: string): ISanityDokumentkravSvar | undefined {
    return context?.dokumentkravSvar.find((svar) => svar.textId === textId);
  }

  return {
    getSeksjonTextById,
    getFaktumTextById,
    getLandGruppeTextById,
    getSvaralternativTextById,
    getAppTekst,
    getStartsideText,
    getDokumentkravTextById,
    getDokumentkravSvarTextById,
  };
}

export { SanityProvider, useSanity };
