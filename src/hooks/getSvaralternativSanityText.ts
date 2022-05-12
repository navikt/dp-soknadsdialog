import { SanitySvaralternativ } from "../types/sanity.types";
import { useSanity } from "../context/sanity-context";

export function getSvaralternativSanityText(textId: string): SanitySvaralternativ | undefined {
  // TODO
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const sanityTexts = useSanity();
  return sanityTexts?.svaralternativer.find((svaralternativ) => svaralternativ.textId === textId);
}
