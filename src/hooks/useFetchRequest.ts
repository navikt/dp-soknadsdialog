import { useCallback, useState } from "react";

export interface IErrorDetails {
  message: string;
  responseCode: number;
}

export type FetchMethod = "POST" | "PUT" | "DELETE" | "GET";
export type FetchStatus = "idle" | "pending" | "success" | "error";

export const GENERIC_ERROR_DETAILS: IErrorDetails = {
  message: "Noe gikk galt! Kunne ikke kommunisere med API.",
  responseCode: 500,
};

export function useFetchRequest<T, U>(
  url: string,
  method: FetchMethod,
  parseResponse: true
): [(body?: T) => Promise<U | undefined>, FetchStatus, IErrorDetails, () => void];

export function useFetchRequest<T>(
  url: string,
  method: FetchMethod,
  parseResponse?: false
): [(body?: T) => Promise<boolean>, FetchStatus, IErrorDetails, () => void];

export function useFetchRequest<T, U>(
  url: string,
  method: FetchMethod,
  parseResponse?: boolean
): [(body?: T) => Promise<boolean | U>, FetchStatus, IErrorDetails, () => void];

export function useFetchRequest<T, U>(
  url: string,
  method: FetchMethod,
  parseResponse?: boolean
): [
  (body?: T) => Promise<boolean | U | undefined>,
  FetchStatus,
  IErrorDetails | undefined,
  () => void
] {
  const [errorDetails, setErrorDetails] = useState<IErrorDetails>();
  const [status, setStatus] = useState<FetchStatus>("idle");
  async function doFetch(body?: T): Promise<boolean | undefined | U> {
    setStatus("pending");
    setErrorDetails(undefined);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH}/api/${url}`, {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        method,
      });

      if (!response.ok) {
        const errorDetails: IErrorDetails = await response.json();
        setStatus("error");
        setErrorDetails({ ...errorDetails, responseCode: response.status });

        if (parseResponse) {
          return undefined;
        } else {
          return false;
        }
      } else {
        setStatus("success");
        if (parseResponse) {
          return await response.json();
        }
      }

      return true;
    } catch (e: unknown) {
      setStatus("error");
      setErrorDetails(GENERIC_ERROR_DETAILS);
      return false;
    }
  }

  const resetError = useCallback(() => {
    setErrorDetails(undefined);
  }, []);

  return [doFetch, status, errorDetails, resetError];
}
