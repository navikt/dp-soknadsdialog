import { IErrorDetails, FetchStatus, useFetchRequest } from "./useFetchRequest";

export function usePutRequest(
  url: string,
  parseResponse?: false
): [() => Promise<boolean>, FetchStatus, IErrorDetails, () => void];

export function usePutRequest<T>(
  url: string,
  parseResponse?: false
): [(body: T) => Promise<boolean>, FetchStatus, IErrorDetails, () => void];

export function usePutRequest<T, U>(
  url: string,
  parseResponse: true
): [(body: T) => Promise<U | undefined>, FetchStatus, IErrorDetails, () => void];

export function usePutRequest<T, U>(
  url: string,
  parseResponse?: boolean
): [(body?: T) => Promise<boolean | U>, FetchStatus, IErrorDetails, () => void] {
  return useFetchRequest<T, U>(url, "PUT", parseResponse);
}
