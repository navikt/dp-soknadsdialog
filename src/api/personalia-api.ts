import { logRequestError } from "../error.logger";

export async function getPersonalia(onBehalfOfToken: string) {
  const url = `${process.env.API_BASE_URL}/personalia`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });

  if (!response.ok) {
    logRequestError(response.statusText, undefined, "Personalia - Failed to get info");

    return new Response("Feil i uthenting av gjeldende periode", {
      status: response.status,
    });
  }

  return response;
}
