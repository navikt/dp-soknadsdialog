import { IDokumentkravListe } from "../types/documentation.types";

export function getDocumentationList(
  uuid: string,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  onBehalfOfToken: string
): Promise<IDokumentkravListe> {
  const url = `${process.env.API_BASE_URL}/soknad/${uuid}/dokumentasjonskrav`;

  const response: IDokumentkravListe = {
    soknad_uuid: "12345",
    krav: [
      {
        id: "5678",
        beskrivendeId: "dokumentasjonskrav.arbeidsforhold",
        filer: [
          {
            filnavn: "hei på du1.jpg",
            urn: "urn:dokumen1",
            timestamp: "1660571365067",
          },
          {
            filnavn: "hei på du2.jpg",
            urn: "urn:dokumen2",
            timestamp: "1660571365067",
          },
          {
            filnavn: "hei på du3.jpg",
            urn: "urn:dokumen3",
            timestamp: "1660571365067",
          },
        ],
        gyldigeValg: [
          "dokumentkrav.send.inn.na",
          "dokumentkrav.send.inn.senere",
          "dokumentkrav.send.inn.noen_andre",
          "dokumentkrav.sendt.inn.tidligere",
          "dokumentkrav.send.inn.sender.ikke",
        ],
      },
      {
        id: "6678",
        beskrivendeId: "dokumentasjonskrav.arbeidsforhold",
        filer: [
          {
            filnavn: "hei på du1.jpg",
            urn: "urn:dokumen1",
            timestamp: "1660571365067",
          },
          {
            filnavn: "hei på du2.jpg",
            urn: "urn:dokumen2",
            timestamp: "1660571365067",
          },
          {
            filnavn: "hei på du3.jpg",
            urn: "urn:dokumen3",
            timestamp: "1660571365067",
          },
        ],
        gyldigeValg: [
          "dokumentkrav.send.inn.na",
          "dokumentkrav.send.inn.senere",
          "dokumentkrav.send.inn.noen_andre",
          "dokumentkrav.sendt.inn.tidligere",
          "dokumentkrav.send.inn.sender.ikke",
        ],
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
