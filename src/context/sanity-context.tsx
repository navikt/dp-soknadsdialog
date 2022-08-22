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
    return context?.seksjoner.find((seksjon) => seksjon.textId === textId);
  }

  function getFaktumTextById(textId: string): ISanityFaktum | undefined {
    return context?.fakta.find((faktum) => faktum.textId === textId);
  }

  function getLandGruppeTextById(textId: string | undefined): ISanityLandGruppe | undefined {
    return context?.landgrupper.find((gruppe) => gruppe.textId === textId);
  }

  function getSvaralternativTextById(textId: string): ISanitySvaralternativ | undefined {
    return context?.svaralternativer.find((svaralternativ) => svaralternativ.textId === textId);
  }

  function getAppTekst(textId: string): string {
    return context?.apptekster.find((apptekst) => apptekst.textId === textId)?.valueText || textId;
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
