import { quizMalResponse } from "../../localhost-data/quiz-mal-response";

export const headersWithToken = (onBehalfOfToken: string) => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${onBehalfOfToken}`,
});

export function getSoknadMal(onBehalfOfToken: string) {
  const url = `${process.env.API_BASE_URL}/soknad/mal`;

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return Promise.resolve(quizMalResponse);
  }

  return fetch(url, {
    method: "Get",
    headers: headersWithToken(onBehalfOfToken),
  })
    .then((response: Response) => response.json())
    .catch((error) => {
      return Promise.reject(error);
    });
}

export type Prosesstype = "Søknad" | "Innsending";

export function startSoknad(onBehalfOfToken: string, prosesstype?: Prosesstype) {
  const url = new URL(`${process.env.API_BASE_URL}/soknad`);
  if (prosesstype) {
    url.searchParams.append("prosesstype", prosesstype);
  }

  return fetch(url, {
    method: "Post",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });
}

export function getSoknadState(uuid: string, onBehalfOfToken: string, lastSaved?: string) {
  let url = `${process.env.API_BASE_URL}/soknad/${uuid}/neste`;

  if (lastSaved) {
    url += `?sistLagret=${lastSaved}`;
  }

  return fetch(url, {
    method: "Get",
    headers: headersWithToken(onBehalfOfToken),
  });
}
