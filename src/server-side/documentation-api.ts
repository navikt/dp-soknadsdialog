import { DokumentkravListe } from "../types/documentation.types";

export function getDocumentationList(
  uuid: string,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  onBehalfOfToken: string
): Promise<DokumentkravListe> {
  const url = `${process.env.API_BASE_URL}/soknad/${uuid}/dokumentasjonskrav`;

  //if (process.env.NEXT_PUBLIC_LOCALHOST) {
  const response: DokumentkravListe = {
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
