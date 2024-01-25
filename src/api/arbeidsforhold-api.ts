import { logRequestError } from "../error.logger";

export async function getArbeidsforhold(onBehalfOfToken: string) {
  const url = `${process.env.API_BASE_URL}/arbeidsforhold`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });

  if (!response.ok) {
    logRequestError(response.statusText, undefined, "Arbeidsforhold - Failed to get info");

    return new Response("Feil i uthenting av arbeidsforhold", {
      status: response.status,
    });
  }

  return response;
}
