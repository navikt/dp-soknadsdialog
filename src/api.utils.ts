import { v4 as uuidV4 } from "uuid";

export const audienceDPSoknad = `${process.env.NAIS_CLUSTER_NAME}:teamdagpenger:dp-soknad`;
export const audienceMellomlagring = `${process.env.NAIS_CLUSTER_NAME}:teamdagpenger:dp-mellomlagring`;

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
  // eslint-disable-next-line no-console
  console.log("Starter request " + reqId);
  return fetch(url, { ...init, headers });
}

declare module "http" {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface IncomingHttpHeaders {
    "x-request-id"?: string;
  }
}
