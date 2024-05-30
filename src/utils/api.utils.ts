import { v4 as uuidV4 } from "uuid";
import { logger } from "@navikt/next-logger";

export default function api(endpoint: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH}/api${
    endpoint.startsWith("/") ? "" : "/"
  }${endpoint}`;
}

export const fetcher = (url: RequestInfo, options: RequestInit = {}): Promise<unknown> =>
  fetch(url, options).then((r: { json: () => unknown }) => r.json());

export function apiFetch(url: string | Request, init: RequestInit | undefined, requestId?: string) {
  const reqId = requestId === undefined ? uuidV4() : requestId;
  const headers = {
    ...init?.headers,
    "x-request-id": reqId,
  };

  logger.info("Starter request " + reqId);
  return fetch(url, { ...init, headers });
}

declare module "http" {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface IncomingHttpHeaders {
    "x-request-id"?: string;
  }
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export async function getErrorDetails(response: Response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}
