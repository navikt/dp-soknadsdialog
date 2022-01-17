import { Faktumtype } from "../types";

export interface MockDataSeksjon {
  id: string;
  faktum: MockDataFaktum[];
}

export interface BaseDataFaktum {
  id: string;
  type: Faktumtype;
  subFaktum: MockDataSubFaktum[];
}

export interface MockDataFaktum {
  id: string;
  type: Faktumtype;
  subFaktum: MockDataSubFaktum[];
  answers: MockDataAnswer[];
}

export interface MockDataSubFaktum extends Omit<MockDataFaktum, "subFaktum"> {
  requiredAnswerId: string;
}

export interface MockDataAnswer {
  id: string;
}

export const mockSeksjoner: MockDataSeksjon[] = [
  {
    id: "reell-arbeidsoker",
    faktum: [
      {
        id: "faktum.hel-deltid",
        type: "boolean",
        answers: [{ id: "faktum.hel-deltid.svar.ja" }, { id: "faktum.hel-deltid.svar.nei" }],
        subFaktum: [
          {
            id: "faktum.kun-deltid-aarsak",
            type: "flervalg",
            requiredAnswerId: "faktum.hel-deltid.svar.nei",
            answers: [
              { id: "faktum.kun-deltid-aarsak.svar.redusert-helse" },
              {
                id: "faktum.kun-deltid-aarsak.svar.omsorg-baby",
              },
              {
                id: "faktum.kun-deltid-aarsak.svar.eneansvar-barn",
              },
              {
                id: "faktum.kun-deltid-aarsak.svar.omsorg-barn-spesielle-behov",
              },
              { id: "faktum.kun-deltid-aarsak.svar.skift-turnus" },
              { id: "faktum.kun-deltid-aarsak.svar.annen-situasjon" },
            ],
          },
          {
            id: "faktum.kun-deltid-aarsak-antall-timer",
            type: "int",
            requiredAnswerId: "faktum.hel-deltid.svar.nei",
            answers: [],
          },
        ],
      },
      {
        id: "faktum.hele-norge",
        type: "boolean",
        answers: [{ id: "faktum.hele-norge.svar.ja" }, { id: "faktum.hele-norge.svar.nei" }],
        subFaktum: [
          {
            id: "faktum.ikke-hele-norge",
            type: "flervalg",
            requiredAnswerId: "faktum.hele-norge.svar.nei",
            answers: [
              { id: "faktum.ikke-hele-norge.svar.redusert-helse" },
              {
                id: "faktum.ikke-hele-norge.svar.omsorg-baby",
              },
              {
                id: "faktum.ikke-hele-norge.svar.eneansvar-barn",
              },
              {
                id: "faktum.ikke-hele-norge.svar.omsorg-barn-spesielle-behov",
              },
              { id: "faktum.ikke-hele-norge.svar.utenfor-naerområdet" },
              { id: "faktum.ikke-hele-norge.svar.annen-situasjon" },
            ],
          },
        ],
      },
      {
        id: "faktum.alle-typer-arbeid",
        type: "boolean",
        answers: [
          { id: "faktum.alle-typer-arbeid.svar.ja" },
          { id: "faktum.alle-typer-arbeid.svar.nei" },
        ],
        subFaktum: [
          {
            id: "faktum.ikke-denne-type-arbeid",
            type: "text",
            requiredAnswerId: "faktum.alle-typer-arbeid.svar.nei",
            answers: [],
          },
        ],
      },
      {
        id: "faktum.ethvert-arbeid",
        type: "boolean",
        answers: [
          { id: "faktum.ethvert-arbeid.svar.ja" },
          { id: "faktum.ethvert-arbeid.svar.nei" },
        ],
        subFaktum: [],
      },
    ],
  },
  {
    id: "arbeidsforhold",
    faktum: [
      {
        id: "faktum.dagpenger-soknadsdato",
        type: "localdate",
        subFaktum: [],
        answers: [],
      },
      {
        id: "faktum.fast-arbeidstid",
        type: "valg",
        subFaktum: [],
        answers: [
          { id: "faktum.fast-arbeidstid.svar.ja-fast" },
          { id: "faktum.fast-arbeidstid.svar.nei-varierende" },
          { id: "faktum.fast-arbeidstid.svar.kombinasjon" },
          { id: "faktum.fast-arbeidstid.svar.ingen-passer" },
        ],
      },
    ],
  },
];
