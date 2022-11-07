import { IErrorDetails, FetchStatus, useFetchRequest } from "./useFetchRequest";

export function usePostRequest<T, U>(
  url: string,
  parseResponse: true
): [(body?: T) => Promise<U | undefined>, FetchStatus, IErrorDetails, () => void];

export function usePostRequest<T>(
  url: string,
  parseResponse?: false
): [(body?: T) => Promise<boolean>, FetchStatus, IErrorDetails, () => void];

export function usePostRequest<T, U>(
  url: string,
  parseResponse?: boolean
): [(body?: T) => Promise<boolean | U>, FetchStatus, IErrorDetails, () => void] {
  return useFetchRequest<T, U>(url, "POST", parseResponse);
}
