import { quizMalResponse } from "../localhost-data/quiz-mal-response";
import { QuizState, quizStateResponse } from "../localhost-data/quiz-state-response";
import { sanityClient } from "../../sanity-client";
import { SanityTexts } from "../types/sanity.types";
import { allTextsQuery } from "../sanity/groq-queries";
import { textStructureToHtml } from "../sanity/textStructureToHtml";
import { Documents } from "../types/documentation.types";

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

export type Prosesstype = "Søknad" | "Innsending";

export function postSoknad(onBehalfOfToken: string, prosesstype?: Prosesstype) {
  const url = new URL(`${process.env.API_BASE_URL}/soknad`);
  if (prosesstype) url.searchParams.append("prosesstype", prosesstype);
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
  const url = `${process.env.API_BASE_URL}/soknad/paabegynt`;
  return fetch(url, {
    method: "Get",
    headers: headersWithToken(onBehalfOfToken),
  })
    .then((response) => response.json())
    .catch((error) => {
      return Promise.reject(error);
    });
}

interface LocalhostOpts {
  firstRender?: boolean;
  summary?: boolean;
}

export function getSoknadState(
  uuid: string,
  onBehalfOfToken: string,
  localhostOpts: LocalhostOpts = {}
): Promise<QuizState> {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    if (localhostOpts.firstRender) {
      const quizSeksjoner = quizStateResponse.seksjoner.map((seksjon) => {
        const fakta = seksjon.fakta.map((faktum) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { svar, ...faktumWithoutAnswer } = faktum;
          return faktumWithoutAnswer;
        });
        return { ...seksjon, ferdig: false, fakta };
      });
      return Promise.resolve({ ...quizStateResponse, seksjoner: quizSeksjoner });
    } else if (localhostOpts.summary) {
      return Promise.resolve({ ...quizStateResponse, ferdig: true });
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

export async function completeSoknad(
  uuid: string,
  lang: string,
  onBehalfOfToken: string
): Promise<Response> {
  const url = `${process.env.API_BASE_URL}/soknad/${uuid}/ferdigstill`;

  const sanityTexts = await sanityClient.fetch<SanityTexts>(allTextsQuery, {
    baseLang: "nb",
    lang,
  });

  const sanityTextsWithHTML = textStructureToHtml(sanityTexts);

  return fetch(url, {
    method: "Put",
    headers: headersWithToken(onBehalfOfToken),
    body: JSON.stringify({ sanityTexts: sanityTextsWithHTML }),
  });
}

export function getDocumentationList(
  uuid: string,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  onBehalfOfToken: string
): Promise<Documents> {
  const url = `${process.env.API_BASE_URL}/soknad/${uuid}/dokumentasjonskrav`;

  //if (process.env.NEXT_PUBLIC_LOCALHOST) {
  const response: Documents = {
    id: "12345",
    list: [
      {
        id: "5678",
        beskrivendeId: "arbeidsforhold.1",
        files: ["urn:dokumen1", "urn:dokumen2", "urn:dokumen3"],
      },
      {
        id: "91011",
        beskrivendeId: "arbeidsforhold.2",
        files: [],
      },
    ],
  };

  return Promise.resolve(response);
  //}

  // return fetch(url, {
  //   method: "Get",
  //   headers: headersWithToken(onBehalfOfToken),
  // })
  //   .then((response: Response) => response.json())
  //   .catch((error) => {
  //     return Promise.reject(error);
  //   });
}
