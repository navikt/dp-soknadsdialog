import React from "react";
import { SanityContext, SanityFaktum } from "../pages/[uuid]";

export function getFaktumSanityText(textId: string): SanityFaktum | undefined {
  const sanityTexts = React.useContext(SanityContext);
  return sanityTexts?.fakta.find((faktum) => faktum.textId === textId);
}
