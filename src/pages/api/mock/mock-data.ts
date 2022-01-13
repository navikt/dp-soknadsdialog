import { Faktumtype } from "../types";

export interface MockDataSeksjon {
  id: string;
  faktum: MockDataFaktum[];
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
        id: "reell-arbeidsoker.faktum.hel-deltid",
        type: "boolean",
        answers: [
          { id: "reell-arbeidsoker.faktum.hel-deltid.ja" },
          { id: "reell-arbeidsoker.faktum.hel-deltid.nei" },
        ],
        subFaktum: [
          {
            id: "reell-arbeidsoker.faktum.hel-deltid.sub-faktum.unntak",
            type: "flervalg",
            requiredAnswerId: "reell-arbeidsoker.faktum.hel-deltid.nei",
            answers: [
              { id: "reell-arbeidsoker.faktum.hel-deltid.sub-faktum.unntak.redusert-helse" },
              {
                id: "reell-arbeidsoker.faktum.hel-deltid.sub-faktum.unntak.omsorg-barn-under-1",
              },
              {
                id: "reell-arbeidsoker.faktum.hel-deltid.sub-faktum.unntak.omsorg-barn-7-klasse",
              },
              {
                id: "reell-arbeidsoker.faktum.hel-deltid.sub-faktum.unntak.omsorg-barn-spesielle-behov",
              },
              { id: "reell-arbeidsoker.faktum.hel-deltid.sub-faktum.unntak.skift-turnus" },
              { id: "reell-arbeidsoker.faktum.hel-deltid.sub-faktum.unntak.annet" },
            ],
          },
        ],
      },
      {
        id: "reell-arbeidsoker.faktum.hele-norge",
        type: "boolean",
        subFaktum: [],
        answers: [
          { id: "reell-arbeidsoker.faktum.hele-norge.ja" },
          { id: "reell-arbeidsoker.faktum.hele-norge.nei" },
        ],
      },
      {
        id: "reell-arbeidsoker.faktum.alle-typer-arbeid",
        type: "boolean",
        subFaktum: [],
        answers: [
          { id: "reell-arbeidsoker.faktum.alle-typer-arbeid.ja" },
          { id: "reell-arbeidsoker.faktum.alle-typer-arbeid.nei" },
        ],
      },
      {
        id: "reell-arbeidsoker.faktum.ethvert-arbeid",
        type: "boolean",
        subFaktum: [],
        answers: [
          { id: "reell-arbeidsoker.faktum.ethvert-arbeid.ja" },
          { id: "reell-arbeidsoker.faktum.ethvert-arbeid.nei" },
        ],
      },
      {
        id: "reell-arbeidsoker.faktum.antall-timer",
        type: "int",
        subFaktum: [],
        answers: [{ id: "reell-arbeidsoker.faktum.antall-timer.antall" }],
      },
    ],
  },
  // {
  //   id: "arbeidsforhold",
  //   faktum: [
  //     {
  //       id: "arbeidsforhold.faktum.dagpenger-dato",
  //       type: "localdate",
  //       subFaktum: [],
  //       answers: [{ id: "arbeidsforhold.faktum.dagpenger-dato.dato" }],
  //     },
  //     {
  //       id: "arbeidsforhold.faktum.fast-arbeidstid",
  //       type: "flervalg",
  //       subFaktum: [],
  //       answers: [
  //         { id: "arbeidsforhold.faktum.fast-arbeidstid.ja-fast" },
  //         { id: "arbeidsforhold.faktum.fast-arbeidstid.nei-varierende" },
  //         { id: "arbeidsforhold.faktum.fast-arbeidstid.kombinasjon" },
  //         { id: "arbeidsforhold.faktum.fast-arbeidstid.ingen-passer" },
  //       ],
  //     },
  //   ],
  // },
];
