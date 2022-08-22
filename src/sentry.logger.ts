import * as Sentry from "@sentry/nextjs";

export function logMissingSanityText(textId: string) {
  Sentry.captureEvent({ message: `Fant ikke seksjonsTekst med id: ${textId}` });
}
