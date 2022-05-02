import { mockFakta } from "../localhost-data/quiz-fakta-response";
import { QuizFaktum } from "../types/quiz.types";
import { quizMalResponse } from "../localhost-data/quiz-mal-response";

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

export function getFakta(soknadId: string, onBehalfOfToken: string): Promise<QuizFaktum[]> {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return Promise.resolve(mockFakta);
  }

  const url = `${process.env.API_BASE_URL}/soknad/${soknadId}/fakta`;
  return fetch(url, {
    method: "Get",
    headers: headersWithToken(onBehalfOfToken),
  })
    .then((response: Response) => response.json())
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function completeSoknad(soknadId: string, onBehalfOfToken: string): Promise<Response> {
  const url = `${process.env.API_BASE_URL}/soknad/${soknadId}/ferdigstill`;
  return fetch(url, {
    method: "Put",
    headers: headersWithToken(onBehalfOfToken),
  });
}
