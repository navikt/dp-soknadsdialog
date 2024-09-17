import React, { PropsWithChildren } from "react";
import {
  ISanityDokumentkrav,
  ISanityDokumentkravSvar,
  ISanityFaktum,
  ISanityInfoside,
  ISanityLandGruppe,
  ISanitySeksjon,
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
    const text = context?.seksjoner.find((seksjon) => seksjon.textId === textId);
    return text;
  }

  function getFaktumTextById(textId: string): ISanityFaktum | undefined {
    const text = context?.fakta.find((faktum) => faktum.textId === textId);
    return text;
  }

  function getLandGruppeTextById(textId: string | undefined): ISanityLandGruppe | undefined {
    return context?.landgrupper.find((gruppe) => gruppe.textId === textId);
  }

  function getSvaralternativTextById(textId: string): ISanitySvaralternativ | undefined {
    const text = context?.svaralternativer.find(
      (svaralternativ) => svaralternativ.textId === textId,
    );

    return text;
  }

  function getAppText(textId: string): string {
    return context?.apptekster.find((apptekst) => apptekst.textId === textId)?.valueText || textId;
  }

  function getInfosideText(textId: string): ISanityInfoside | undefined {
    return context?.infosider.find((side) => side.textId === textId);
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
    getAppText,
    getDokumentkravTextById,
    getDokumentkravSvarTextById,
    getInfosideText,
  };
}

export { SanityProvider, useSanity };
