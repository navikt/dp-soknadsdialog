export type ApiFaktumType = "boolean" | "date" | "multi";

export interface ApiSeksjon {
  id: string;
  faktum: ApiFaktum[];
}

export interface ApiFaktum {
  id: string;
  type: ApiFaktumType;
  subFaktum: ApiSubFaktum[];
  answers: ApiAnswer[];
}

export interface ApiSubFaktum extends Omit<ApiFaktum, "subFaktum"> {
  requiredAnswerId: string;
}

export interface ApiAnswer {
  id: string;
}

export const mockSeksjoner: ApiSeksjon[] = [
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
            type: "multi",
            requiredAnswerId: "reell-arbeidsoker.faktum.hel-deltid.nei",
            answers: [
              { id: "reell-arbeidsoker.faktum.hel-deltid.sub-faktum.unntak.redusert-helse" },
              { id: "reell-arbeidsoker.faktum.hel-deltid.sub-faktum.unntak.omsorg-barn-under-1" },
              { id: "reell-arbeidsoker.faktum.hel-deltid.sub-faktum.unntak.omsorg-barn-7-klasse" },
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
    ],
  },
  {
    id: "arbeidsforhold",
    faktum: [
      {
        id: "arbeidsforhold.faktum.dagpenger-dato",
        type: "date",
        subFaktum: [],
        answers: [{ id: "arbeidsforhold.faktum.dagpenger-dato.dato" }],
      },
      {
        id: "arbeidsforhold.faktum.fast-arbeidstid",
        type: "multi",
        subFaktum: [],
        answers: [
          { id: "arbeidsforhold.faktum.fast-arbeidstid.ja-fast" },
          { id: "arbeidsforhold.faktum.fast-arbeidstid.nei-varierende" },
          { id: "arbeidsforhold.faktum.fast-arbeidstid.kombinasjon" },
          { id: "arbeidsforhold.faktum.fast-arbeidstid.ingen-passer" },
        ],
      },
    ],
  },
];
