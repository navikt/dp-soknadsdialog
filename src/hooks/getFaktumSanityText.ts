import { SanityFaktum } from "../types/sanity.types";
import { useSanity } from "../context/sanity-context";

export function getFaktumSanityText(textId: string): SanityFaktum | undefined {
  // TODO
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const sanityTexts = useSanity();
  return sanityTexts?.fakta.find((faktum) => faktum.textId === textId);
}
