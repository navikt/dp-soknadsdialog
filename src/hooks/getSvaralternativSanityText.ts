import React from "react";
import { SanityContext } from "../pages/[uuid]";
import { SanitySvaralternativ } from "../types/sanity.types";

export function getSvaralternativSanityText(textId: string): SanitySvaralternativ | undefined {
  const sanityTexts = React.useContext(SanityContext);
  return sanityTexts?.svaralternativer.find((svaralternativ) => svaralternativ.textId === textId);
}
