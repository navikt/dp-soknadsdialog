import * as Sentry from "@sentry/nextjs";

export function logMissingSanityText(textId: string) {
  Sentry.captureException(new MissingTextError(`Mangler tekst for "${textId}"`));
}

class MissingTextError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissingTextError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
