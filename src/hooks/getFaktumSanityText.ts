import React from "react";
import { SanityContext } from "../pages/[uuid]";
import { SanityFaktum } from "../types/sanity.types";

export function getFaktumSanityText(textId: string): SanityFaktum | undefined {
  const sanityTexts = React.useContext(SanityContext);
  return sanityTexts?.fakta.find((faktum) => faktum.textId === textId);
}
