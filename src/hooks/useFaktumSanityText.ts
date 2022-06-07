import { SanityFaktum } from "../types/sanity.types";
import { useSanity } from "../context/sanity-context";

export function useFaktumSanityText(textId: string): SanityFaktum | undefined {
  const sanityTexts = useSanity();
  return sanityTexts?.fakta.find((faktum) => faktum.textId === textId);
}
