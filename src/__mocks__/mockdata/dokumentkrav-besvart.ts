import { IDokumentkravList } from "../../types/documentation.types";

export const mockDokumentkravBesvart: IDokumentkravList = {
  soknad_uuid: "e0424e22-57c5-46b0-a0b1-6be27714a562",
  krav: [
    {
      id: "7002",
      beskrivendeId:
        "faktum.dokument-avtjent-militaer-sivilforsvar-tjeneste-siste-12-mnd-dokumentasjon",
      fakta: [
        {
          id: "7001",
          svar: true,
          type: "boolean",
          roller: ["søker"],
          readOnly: false,
          gyldigeValg: [
            "faktum.avtjent-militaer-sivilforsvar-tjeneste-siste-12-mnd.svar.ja",
            "faktum.avtjent-militaer-sivilforsvar-tjeneste-siste-12-mnd.svar.nei",
          ],
          beskrivendeId: "faktum.avtjent-militaer-sivilforsvar-tjeneste-siste-12-mnd",
          sannsynliggjoresAv: [
            {
              id: "7002",
              type: "dokument",
              roller: ["søker"],
              readOnly: true,
              beskrivendeId:
                "faktum.dokument-avtjent-militaer-sivilforsvar-tjeneste-siste-12-mnd-dokumentasjon",
              sannsynliggjoresAv: [],
            },
          ],
        },
      ],
      filer: [],
      gyldigeValg: [
        "dokumentkrav.svar.send.naa",
        "dokumentkrav.svar.send.senere",
        "dokumentkrav.svar.sendt.tidligere",
        "dokumentkrav.svar.sender.ikke",
        "dokumentkrav.svar.andre.sender",
      ],
      begrunnelse: "Arbeidsgiver sender det for meg",
      svar: "dokumentkrav.svar.andre.sender",
    },
    {
      id: "5028",
      beskrivendeId: "faktum.dokument-okonomiske-goder-tidligere-arbeidsgiver",
      fakta: [
        {
          id: "5012",
          svar: true,
          type: "boolean",
          roller: ["søker"],
          readOnly: false,
          gyldigeValg: [
            "faktum.utbetaling-eller-okonomisk-gode-tidligere-arbeidsgiver.svar.ja",
            "faktum.utbetaling-eller-okonomisk-gode-tidligere-arbeidsgiver.svar.nei",
          ],
          beskrivendeId: "faktum.utbetaling-eller-okonomisk-gode-tidligere-arbeidsgiver",
          sannsynliggjoresAv: [
            {
              id: "5028",
              type: "dokument",
              roller: ["søker"],
              readOnly: true,
              beskrivendeId: "faktum.dokument-okonomiske-goder-tidligere-arbeidsgiver",
              sannsynliggjoresAv: [],
            },
          ],
        },
      ],
      filer: [],
      gyldigeValg: [
        "dokumentkrav.svar.send.naa",
        "dokumentkrav.svar.send.senere",
        "dokumentkrav.svar.sendt.tidligere",
        "dokumentkrav.svar.sender.ikke",
        "dokumentkrav.svar.andre.sender",
      ],
      // begrunnelse: "Arbeidsgiver nekter å gi meg dokumentet",
      // svar: "dokumentkrav.svar.sender.ikke",
    },
    {
      id: "2004",
      beskrivendeId: "faktum.dokument-utdanning-sluttdato",
      fakta: [
        {
          id: "2002",
          svar: true,
          type: "boolean",
          roller: ["søker"],
          readOnly: false,
          gyldigeValg: [
            "faktum.avsluttet-utdanning-siste-6-mnd.svar.ja",
            "faktum.avsluttet-utdanning-siste-6-mnd.svar.nei",
          ],
          beskrivendeId: "faktum.avsluttet-utdanning-siste-6-mnd",
          sannsynliggjoresAv: [
            {
              id: "2004",
              type: "dokument",
              roller: ["søker"],
              readOnly: true,
              beskrivendeId: "faktum.dokument-utdanning-sluttdato",
              sannsynliggjoresAv: [],
            },
          ],
        },
      ],
      filer: [],
      gyldigeValg: [
        "dokumentkrav.svar.send.naa",
        "dokumentkrav.svar.send.senere",
        "dokumentkrav.svar.sendt.tidligere",
        "dokumentkrav.svar.sender.ikke",
        "dokumentkrav.svar.andre.sender",
      ],
      begrunnelse: "Jeg sendte det forrige gang",
      svar: "dokumentkrav.svar.sendt.tidligere",
    },
    {
      id: "10",
      beskrivendeId: "faktum.dokument-bekreftelse-fra-lege-eller-annen-behandler",
      fakta: [
        {
          id: "2",
          svar: [
            "faktum.kun-deltid-aarsak.svar.redusert-helse",
            "faktum.kun-deltid-aarsak.svar.omsorg-baby",
          ],
          type: "flervalg",
          roller: ["søker"],
          readOnly: false,
          gyldigeValg: [
            "faktum.kun-deltid-aarsak.svar.redusert-helse",
            "faktum.kun-deltid-aarsak.svar.omsorg-baby",
            "faktum.kun-deltid-aarsak.svar.eneansvar-barn",
            "faktum.kun-deltid-aarsak.svar.omsorg-barn-spesielle-behov",
            "faktum.kun-deltid-aarsak.svar.skift-turnus",
            "faktum.kun-deltid-aarsak.svar.har-fylt-60",
            "faktum.kun-deltid-aarsak.svar.annen-situasjon",
          ],
          beskrivendeId: "faktum.kun-deltid-aarsak",
          sannsynliggjoresAv: [
            {
              id: "10",
              type: "dokument",
              roller: ["søker"],
              readOnly: true,
              beskrivendeId: "faktum.dokument-bekreftelse-fra-lege-eller-annen-behandler",
              sannsynliggjoresAv: [],
            },
            {
              id: "11",
              type: "dokument",
              roller: ["søker"],
              readOnly: true,
              beskrivendeId: "faktum.dokument-fulltid-bekreftelse-fra-relevant-fagpersonell",
              sannsynliggjoresAv: [],
            },
          ],
        },
        {
          id: "8",
          svar: false,
          type: "boolean",
          roller: ["søker"],
          readOnly: false,
          gyldigeValg: ["faktum.alle-typer-arbeid.svar.ja", "faktum.alle-typer-arbeid.svar.nei"],
          beskrivendeId: "faktum.alle-typer-arbeid",
          sannsynliggjoresAv: [
            {
              id: "10",
              type: "dokument",
              roller: ["søker"],
              readOnly: true,
              beskrivendeId: "faktum.dokument-bekreftelse-fra-lege-eller-annen-behandler",
              sannsynliggjoresAv: [],
            },
          ],
        },
      ],
      filer: [
        {
          filnavn: "netto.pdf",
          filsti: "e0424e22-57c5-46b0-a0b1-6be27714a562/10/1120423b-e520-4b62-af3b-cf23995cca33",
          urn: "urn:vedlegg:e0424e22-57c5-46b0-a0b1-6be27714a562/10/1120423b-e520-4b62-af3b-cf23995cca33",
          storrelse: 111908,
          tidspunkt: "2023-01-16T09:24:44.041258+01:00",
          bundlet: true,
        },
      ],
      gyldigeValg: [
        "dokumentkrav.svar.send.naa",
        "dokumentkrav.svar.send.senere",
        "dokumentkrav.svar.sendt.tidligere",
        "dokumentkrav.svar.sender.ikke",
        "dokumentkrav.svar.andre.sender",
      ],
      svar: "dokumentkrav.svar.send.naa",
      bundle:
        "urn:vedlegg:e0424e22-57c5-46b0-a0b1-6be27714a562/abd14822-31f3-4d3b-a618-f3442ea1cc06",
      bundleFilsti: "e0424e22-57c5-46b0-a0b1-6be27714a562/abd14822-31f3-4d3b-a618-f3442ea1cc06",
    },
    {
      id: "11",
      beskrivendeId: "faktum.dokument-fulltid-bekreftelse-fra-relevant-fagpersonell",
      fakta: [
        {
          id: "2",
          svar: ["faktum.kun-deltid-aarsak.svar.redusert-helse"],
          type: "flervalg",
          roller: ["søker"],
          readOnly: false,
          gyldigeValg: [
            "faktum.kun-deltid-aarsak.svar.redusert-helse",
            "faktum.kun-deltid-aarsak.svar.omsorg-baby",
            "faktum.kun-deltid-aarsak.svar.eneansvar-barn",
            "faktum.kun-deltid-aarsak.svar.omsorg-barn-spesielle-behov",
            "faktum.kun-deltid-aarsak.svar.skift-turnus",
            "faktum.kun-deltid-aarsak.svar.har-fylt-60",
            "faktum.kun-deltid-aarsak.svar.annen-situasjon",
          ],
          beskrivendeId: "faktum.kun-deltid-aarsak",
          sannsynliggjoresAv: [
            {
              id: "11",
              type: "dokument",
              roller: ["søker"],
              readOnly: true,
              beskrivendeId: "faktum.dokument-fulltid-bekreftelse-fra-relevant-fagpersonell",
              sannsynliggjoresAv: [],
            },
          ],
        },
      ],
      filer: [],
      gyldigeValg: [
        "dokumentkrav.svar.send.naa",
        "dokumentkrav.svar.send.senere",
        "dokumentkrav.svar.sendt.tidligere",
        "dokumentkrav.svar.sender.ikke",
        "dokumentkrav.svar.andre.sender",
      ],
      begrunnelse: "Jeg sender det når jeg har dokumentet",
      svar: "dokumentkrav.svar.send.senere",
    },
  ],
} as unknown as IDokumentkravList;
