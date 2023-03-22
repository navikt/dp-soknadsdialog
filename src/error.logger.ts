import { logger } from "@navikt/next-logger";
import * as Sentry from "@sentry/nextjs";

export function logMissingSanityText(textId: string) {
  Sentry.captureException(new MissingTextError(`Mangler tekst for "${textId}"`));
}

export function logRequestError(error: string, uuid?: string) {
  const uuidWithFallback = uuid ?? "Not provided";
  Sentry.captureException(new RequestError(`${error}`), {
    tags: {
      uuid: uuidWithFallback,
    },
  });

  logger.error(`RequestError: ${error}, uuid: ${uuidWithFallback}`);
}

class MissingTextError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissingTextError";
  }
}

export class RequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RequestError";
  }
}
