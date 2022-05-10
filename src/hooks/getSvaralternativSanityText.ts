import React from "react";
import { SanityContext, SanitySvaralternativ } from "../pages/[uuid]";

export function getSvaralternativSanityText(textId: string): SanitySvaralternativ | undefined {
  const sanityTexts = React.useContext(SanityContext);
  return sanityTexts?.svaralternativer.find((svaralternativ) => svaralternativ.textId === textId);
}
