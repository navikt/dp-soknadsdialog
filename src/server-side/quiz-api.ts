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

export function getPaabegynt(onBehalfOfToken: string) {
  const url = `${process.env.API_BASE_URL}/paabegynt`;
  return fetch(url, {
    method: "Get",
    headers: headersWithToken(onBehalfOfToken),
  })
    .then((response) => response.json())
    .catch((error) => {
      return Promise.reject(error);
    });
}

export function getSoknadState(
  uuid: string,
  onBehalfOfToken: string,
  localhostFirstRender = false
): Promise<QuizState> {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    if (localhostFirstRender) {
      const quizSeksjoner = quizStateResponse.seksjoner.map((seksjon) => {
        const fakta = seksjon.fakta.map((faktum) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { svar, ...faktumWithoutAnswer } = faktum;
          return faktumWithoutAnswer;
        });
        return { ...seksjon, fakta };
      });
      return Promise.resolve({ ...quizStateResponse, seksjoner: quizSeksjoner });
    }
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

export function completeSoknad(uuid: string, onBehalfOfToken: string): Promise<Response> {
  const url = `${process.env.API_BASE_URL}/soknad/${uuid}/ferdigstill`;
  return fetch(url, {
    method: "Put",
    headers: headersWithToken(onBehalfOfToken),
  });
}
