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
        answers: [
          { id: "faktum.hel-deltid.answer.ja" },
          { id: "faktum.hel-deltid.answer.nei" },
        ],
        subFaktum: [
          {
            id: "faktum.kun-deltid-aarsak",
            type: "flervalg",
            requiredAnswerId: "faktum.hel-deltid.answer.nei",
            answers: [
              { id: "faktum.kun-deltid-aarsak.answer.redusert-helse" },
              {
                id: "faktum.kun-deltid-aarsak.answer.omsorg-baby",
              },
              {
                id: "faktum.kun-deltid-aarsak.answer.eneansvar-barn",
              },
              {
                id: "faktum.kun-deltid-aarsak.answer.omsorg-barn-spesielle-behov",
              },
              { id: "faktum.kun-deltid-aarsak.answer.skift-turnus" },
              { id: "faktum.kun-deltid-aarsak.answer.annen-situasjon" },
            ],
          },
          {
            id: "faktum.kun-deltid-aarsak-antall-timer",
            type: "int",
            requiredAnswerId: "faktum.hel-deltid.answer.nei",
            answers: []
          }
        ],
      },
      {
        id: "faktum.hele-norge",
        type: "boolean",
        answers: [
          { id: "faktum.hele-norge.answer.ja" },
          { id: "faktum.hele-norge.answer.nei" },
        ],
        subFaktum: [
          {
            id: "faktum.ikke-hele-norge",
            type: "flervalg",
            requiredAnswerId: "faktum.hele-norge.answer.nei",
            answers: [
              { id: "faktum.ikke-hele-norge.answer.redusert-helse" },
              {
                id: "faktum.ikke-hele-norge.answer.omsorg-baby",
              },
              {
                id: "faktum.ikke-hele-norge.answer.eneansvar-barn",
              },
              {
                id: "faktum.ikke-hele-norge.answer.omsorg-barn-spesielle-behov",
              },
              { id: "faktum.ikke-hele-norge.answer.utenfor-naerområdet" },
              { id: "faktum.ikke-hele-norge.answer.annen-situasjon" },
            ],
          },
        ],
      },
      {
        id: "faktum.alle-typer-arbeid",
        type: "boolean",
        answers: [
          { id: "faktum.alle-typer-arbeid.answer.ja" },
          { id: "faktum.alle-typer-arbeid.answer.nei" },
        ],
        subFaktum: [
          {
            id: "faktum.ikke-denne-type-arbeid",
            type: "text",
            requiredAnswerId: "faktum.alle-typer-arbeid.answer.nei",
            answers: [],
          },
        ],
      },
      {
        id: "faktum.ethvert-arbeid",
        type: "boolean",
        answers: [
          { id: "faktum.ethvert-arbeid.answer.ja" },
          { id: "faktum.ethvert-arbeid.answer.nei" },
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
          { id: "faktum.fast-arbeidstid.answer.ja-fast" },
          { id: "faktum.fast-arbeidstid.answer.nei-varierende" },
          { id: "faktum.fast-arbeidstid.answer.kombinasjon" },
          { id: "faktum.fast-arbeidstid.answer.ingen-passer" },
        ],
      },
    ],
  },
];
