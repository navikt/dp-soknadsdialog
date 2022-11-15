import * as Sentry from "@sentry/nextjs";
import { RequestErrorType } from "./sentry-constants";

export function logMissingSanityText(textId: string) {
  Sentry.captureException(new MissingTextError(`Mangler tekst for "${textId}"`));
}

export function logRequestError(error: RequestErrorType, uuid?: string) {
  Sentry.captureException(new RequestError(`${error}`), {
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

class RequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RequestError";
  }
}
