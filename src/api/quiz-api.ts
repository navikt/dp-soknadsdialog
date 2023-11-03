import { formatISO, subDays } from "date-fns";
import { v4 as uuidV4 } from "uuid";
import { quizMalResponse } from "../localhost-data/quiz-mal-response";

export const headersWithToken = (onBehalfOfToken: string) => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${onBehalfOfToken}`,
});

export function getSoknadMal(onBehalfOfToken: string) {
  const url = `${process.env.API_BASE_URL}/soknad/mal`;

  if (process.env.USE_MOCKS) {
    return Promise.resolve(quizMalResponse);
  }

  return fetch(url, {
    method: "GET",
    headers: headersWithToken(onBehalfOfToken),
  })
    .then((response: Response) => response.json())
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function createSoknadUuid(onBehalfOfToken: string) {
  const url = `${process.env.API_BASE_URL}/soknad`;

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });
}

export function getMineSoknader(onBehalfOfToken: string) {
  const fromDate = subDays(Date.now(), 30);
  const formattedDate = formatISO(fromDate, { representation: "date" });

  const url = `${process.env.API_BASE_URL}/soknad/mine-soknader?fom=${formattedDate}`;
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });
}

export function createInnsendingUuid(onBehalfOfToken: string) {
  const url = `${process.env.API_BASE_URL}/soknad?prosesstype=Innsending`;

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });
}

export function getSoknadState(
  uuid: string,
  onBehalfOfToken: string,
  lastSaved?: string,
  requestId?: string
) {
  let url = `${process.env.API_BASE_URL}/soknad/${uuid}/neste`;

  if (lastSaved) {
    url += `?sistLagret=${lastSaved}`;
  }

  return fetch(url, {
    method: "GET",
    headers: {
      ...headersWithToken(onBehalfOfToken),
      "X-Request-ID": requestId || uuidV4(),
    },
  });
}

export function getSoknadStatus(uuid: string, onBehalfOfToken: string) {
  return fetch(`${process.env.API_BASE_URL}/soknad/${uuid}/status`, {
    method: "GET",
    headers: headersWithToken(onBehalfOfToken),
  });
}
