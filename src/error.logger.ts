import { logger } from "@navikt/next-logger";

export function logRequestError(error: string, uuid?: string, message?: string) {
  const uuidWithFallback = uuid ?? "Not provided";
  const messageWithFallback = message ?? "RequestError:";

  logger.error(`${messageWithFallback}: ${error}, uuid: ${uuidWithFallback}`);
}

export class RequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RequestError";
  }
}
