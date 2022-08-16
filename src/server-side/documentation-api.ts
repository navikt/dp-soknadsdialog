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
        beskrivendeId: "dokumentasjonskrav.krav.arbeidsforhold",
        fakta: [
          {
            id: "8004.1",
            svar: "Rema 1000",
            type: "tekst",
            readOnly: false,
            beskrivendeId: "faktum.arbeidsforhold.navn-bedrift",
          },
        ],
        filer: [
          {
            filnavn: "hei på du1.jpg",
            urn: "urn:dokumen1",
            tidspunkt: "1660571365067",
            storrelse: 12345,
          },
          {
            filnavn: "hei på du2.jpg",
            urn: "urn:dokumen2",
            tidspunkt: "1660571365067",
            storrelse: 12345,
          },
          {
            filnavn: "hei på du3.jpg",
            urn: "urn:dokumen3",
            tidspunkt: "1660571365067",
            storrelse: 12345,
          },
        ],
        gyldigeValg: [
          "dokumentkrav.svar.send.inn.na",
          "dokumentkrav.svar.send.inn.senere",
          "dokumentkrav.svar.send.inn.noen_andre",
          "dokumentkrav.svar.sendt.inn.tidligere",
          "dokumentkrav.svar.send.inn.sender.ikke",
        ],
      },
      {
        id: "6678",
        beskrivendeId: "dokumentasjonskrav.krav.arbeidsforhold",
        fakta: [
          {
            id: "8004.1",
            svar: "Rema 1000",
            type: "tekst",
            readOnly: false,
            beskrivendeId: "faktum.arbeidsforhold.navn-bedrift",
          },
        ],
        filer: [],
        gyldigeValg: [
          "dokumentkrav.svar.send.inn.na",
          "dokumentkrav.svar.send.inn.senere",
          "dokumentkrav.svar.send.inn.noen_andre",
          "dokumentkrav.svar.sendt.inn.tidligere",
          "dokumentkrav.svar.send.inn.sender.ikke",
        ],
        svar: "dokumentkrav.svar.send.inn.sender.ikke",
        begrunnelse: "Jeg har ingen dokumenter å sende inn. De gikk tapt i en husbrann.",
      },
      {
        id: "6778",
        beskrivendeId: "dokumentasjonskrav.krav.arbeidsforhold",
        fakta: [],
        filer: [],
        gyldigeValg: [
          "dokumentkrav.svar.send.inn.na",
          "dokumentkrav.svar.send.inn.senere",
          "dokumentkrav.svar.send.inn.noen_andre",
          "dokumentkrav.svar.sendt.inn.tidligere",
          "dokumentkrav.svar.send.inn.sender.ikke",
        ],
        svar: "",
        begrunnelse: "",
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
