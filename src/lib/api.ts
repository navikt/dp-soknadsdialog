import useSWR from "swr";
import { Seksjon } from "../models/quiz";

export default function api(endpoint: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH}/api${
    endpoint.startsWith("/") ? "" : "/"
  }${endpoint}`;
}

export const fetcher = (
  url: RequestInfo,
  options: RequestInit = {}
): Promise<unknown> => fetch(url, options).then((r) => r.json());

export function HentNesteSeksjon(id: string): {
  seksjon: Seksjon;
  isLoading: boolean;
  isError: boolean;
} {
  const { data, error } = useSWR<Seksjon>(
    api(`/soknad/${id}/neste-seksjon`),
    fetcher
  );

  return {
    seksjon: data,
    isLoading: !error && !data,
    isError: error,
  };
}
