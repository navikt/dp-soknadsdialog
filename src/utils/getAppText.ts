import { ISanityTexts } from "./../types/sanity.types";
import * as SentryLogger from "../sentry.logger";

export function getAppTekst(textId: string, sanityText: ISanityTexts): string {
  const text =
    sanityText?.apptekster.find((apptekst) => apptekst.textId === textId)?.valueText || textId;
  if (!text) {
    SentryLogger.logMissingSanityText(textId);
  }
  return text;
}
