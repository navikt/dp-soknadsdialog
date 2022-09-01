import { IDokumentkravList } from "../types/documentation.types";

export const mockDokumentkravList: IDokumentkravList = {
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
          urn: "urn:vedlegg:soknad-uuid/faktumId/file-id-1",
          tidspunkt: "1660571365067",
          storrelse: 12345,
          filsti: "soknad-uuid/faktumId/file-id-1",
        },
        {
          filnavn: "hei på du2.jpg",
          urn: "urn:vedlegg:soknad-uuid/faktumId/file-id-2",
          tidspunkt: "1660571365067",
          storrelse: 12345,
          filsti: "soknad-uuid/faktumId/file-id-2",
        },
        {
          filnavn: "hei på du3.jpg",
          urn: "urn:vedlegg:soknad-uuid/faktumId/file-id-3",
          tidspunkt: "1660571365067",
          storrelse: 12345,
          filsti: "soknad-uuid/faktumId/file-id-3",
        },
      ],
      gyldigeValg: [
        "dokumentkrav.svar.send.naa",
        "dokumentkrav.svar.send.senere",
        "dokumentkrav.svar.send.noen_andre",
        "dokumentkrav.svar.sendt.tidligere",
        "dokumentkrav.svar.sender.ikke",
      ],
      svar: "dokumentkrav.svar.send.naa",
      begrunnelse: "",
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
        "dokumentkrav.svar.send.naa",
        "dokumentkrav.svar.send.senere",
        "dokumentkrav.svar.send.noen_andre",
        "dokumentkrav.svar.sendt.inn.tidligere",
        "dokumentkrav.svar.sender.ikke",
      ],
      svar: "dokumentkrav.svar.sender.ikke",
      begrunnelse: "Jeg har ingen dokumenter å sende inn. De gikk tapt i en husbrann.",
    },
    {
      id: "6778",
      beskrivendeId: "dokumentasjonskrav.krav.arbeidsforhold",
      fakta: [],
      filer: [],
      gyldigeValg: [
        "dokumentkrav.svar.send.naa",
        "dokumentkrav.svar.send.senere",
        "dokumentkrav.svar.send.noen_andre",
        "dokumentkrav.svar.sendt.inn.tidligere",
        "dokumentkrav.svar.sender.ikke",
      ],
      svar: "",
      begrunnelse: "",
    },
  ],
};

export const mockMellomlagringLagreFil = [
  {
    filnavn: "hei på du1.jpg",
    urn: "urn:vedlegg:soknad-uuid/faktumId/file-id-1",
    tidspunkt: "1660571365067",
    storrelse: 12345,
    filsti: "soknad-uuid/faktumId/file-id",
  },
];
