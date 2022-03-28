export const host = process.env.SELF_URL;
export const audience = `${process.env.NAIS_CLUSTER_NAME}:teamdagpenger:dp-soknad`;

export default function api(endpoint: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH}/api${
    endpoint.startsWith("/") ? "" : "/"
  }${endpoint}`;
}

export const fetcher = (url: RequestInfo, options: RequestInit = {}): Promise<unknown> =>
  fetch(url, options).then((r: { json: () => unknown }) => r.json());
