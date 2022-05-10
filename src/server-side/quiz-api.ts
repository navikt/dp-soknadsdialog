import { mockFakta } from "../localhost-data/quiz-fakta-response";
import { QuizFaktum } from "../types/quiz.types";
import { quizMalResponse } from "../localhost-data/quiz-mal-response";
import { QuizState, quizStateResponse } from "../localhost-data/quiz-state-response";

const headersWithToken = (onBehalfOfToken: string) => ({
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
export function postSoknad(onBehalfOfToken: string) {
  const url = `${process.env.API_BASE_URL}/soknad`;
  return fetch(url, {
    method: "Post",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  })
    .then((response) => response.text())
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function getSoknadState(uuid: string, onBehalfOfToken: string): Promise<QuizState> {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return Promise.resolve(quizStateResponse);
  }

  const url = `${process.env.API_BASE_URL}/soknad/${uuid}/neste`;
  return fetch(url, {
    method: "Get",
    headers: headersWithToken(onBehalfOfToken),
  })
    .then((response: Response) => response.json())
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function getFakta(uuid: string, onBehalfOfToken: string): Promise<QuizFaktum[]> {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return Promise.resolve(mockFakta);
  }

  const url = `${process.env.API_BASE_URL}/soknad/${uuid}/fakta`;
  return fetch(url, {
    method: "Get",
    headers: headersWithToken(onBehalfOfToken),
  })
    .then((response: Response) => response.json())
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function completeSoknad(uuid: string, onBehalfOfToken: string): Promise<Response> {
  const url = `${process.env.API_BASE_URL}/soknad/${uuid}/ferdigstill`;
  return fetch(url, {
    method: "Put",
    headers: headersWithToken(onBehalfOfToken),
  });
}
