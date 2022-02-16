import { IFaktum } from "../types/faktum.types";

export interface QuizApi {
  postSoknad: () => void;
  getFakta: (soknadId: string) => void;
  putFaktumSvar: (soknadId: string, beskrivendeId: string, faktumSvar: never) => void;
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

export function getFakta(soknadId: string, onBehalfOfToken: string): Promise<IFaktum[]> {
  const url = `${process.env.API_BASE_URL}/soknad/${soknadId}/fakta`;
  return fetch(url, {
    method: "Get",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  })
    .then((response: Response) => response.json())
    .catch((error) => {
      return Promise.reject(error);
    });
}
