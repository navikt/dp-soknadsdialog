import * as Sentry from "@sentry/nextjs";

export function logMissingSanityText(textId: string) {
  Sentry.captureException(new MissingTextException(`Mangler tekst for "${textId}"`));
}

class MissingTextException extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
