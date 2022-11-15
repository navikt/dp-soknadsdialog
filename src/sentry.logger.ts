import * as Sentry from "@sentry/nextjs";
import { SentryLoggingErrorType } from "./sentry-constants";

export function logMissingSanityText(textId: string) {
  Sentry.captureException(new MissingTextError(`Mangler tekst for "${textId}"`));
}

export function logFetchError(error: SentryLoggingErrorType, uuid?: string) {
  Sentry.captureException(new FetchError(`${error}`), {
    tags: {
      uuid: uuid ?? "Not provided",
    },
  });
}

class MissingTextError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissingTextError";
  }
}

class FetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FetchError";
  }
}
