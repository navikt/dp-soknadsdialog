import { Faktumtype } from "../types";

export interface MockDataSeksjon {
  id: string;
  faktum: MockDataFaktum[];
}
export type MockDataFaktum = MockDataGeneratorFaktum | MockDataValgFaktum;

export interface MockDataBaseFaktum {
  id: string;
}

export interface MockDataValgFaktum extends MockDataBaseFaktum {
  type: "boolean" | "valg" | "flervalg";
  subFaktum: MockDataSubFaktum[];
  answers: MockDataAnswer[];
}

export interface MockDataSubFaktum extends MockDataFaktum {
  requiredAnswerId: string[];
}

export interface MockDataAnswer {
  id: string;
}
export interface MockDataGeneratorFaktum extends MockDataBaseFaktum {}

export const mockSeksjoner: MockDataSeksjon[] = [
  {
    id: "korona-fortsatt-rett",
    faktum: [
      {
        id: "faktum.oppbrukt-dagpengeperiode",
        type: "boolean",
        answers: [
          { id: "faktum.oppbrukt-dagpengeperiode.svar.ja" },
          { id: "faktum.oppbrukt-dagpengeperiode.svar.nei" },
        ],
        subFaktum: [
          {
            id: "faktum.onsker-fortsette-avsluttet-periode",
            type: "boolean",
            requiredAnswerId: ["faktum.oppbrukt-dagpengeperiode.svar.ja"],
            answers: [
              { id: "faktum.onsker-fortsette-avsluttet-periode.svar.ja" },
              { id: "faktum.onsker-fortsette-avsluttet-periode.svar.nei" },
            ],
            subFaktum: [],
          },
        ],
      },
    ],
  },
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
            requiredAnswerId: ["faktum.hel-deltid.svar.nei"],
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
            subFaktum: [],
          },
          {
            id: "faktum.kun-deltid-aarsak-antall-timer",
            type: "int",
            requiredAnswerId: ["faktum.hel-deltid.svar.nei"],
            answers: [],
            subFaktum: [],
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
            requiredAnswerId: ["faktum.hele-norge.svar.nei"],
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
            subFaktum: [],
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
            type: "tekst",
            requiredAnswerId: ["faktum.alle-typer-arbeid.svar.nei"],
            answers: [],
            subFaktum: [],
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
        answers: [],
        subFaktum: [],
      },
      {
        id: "faktum.fast-arbeidstid",
        type: "valg",
        answers: [
          { id: "faktum.fast-arbeidstid.svar.ja-fast" },
          { id: "faktum.fast-arbeidstid.svar.nei-varierende" },
          { id: "faktum.fast-arbeidstid.svar.kombinasjon" },
          { id: "faktum.fast-arbeidstid.svar.ingen-passer" },
        ],
        subFaktum: [],
      },
      {
        id: "faktum.arbeidsforhold",
        type: "generator",
        subFaktum: [
          {
            id: "faktum.navn-bedrift",
            type: "tekst",
            requiredAnswerId: [""],
            answers: [],
            subFaktum: [],
          },
          {
            id: "faktum.arbeidsforhold-land",
            type: "dropdown",
            requiredAnswerId: [""],
            answers: [], // liste over alle land? generere maskinelt? quiz?
            subFaktum: [],
          },
          {
            id: "faktum.arbeidsforhold-aarsak",
            type: "valg",
            requiredAnswerId: [""],
            answers: [
              { id: "faktum.arbeidsforhold-aarsak.svar.sagt-opp-av-arbeidsgiver" },
              { id: "faktum.arbeidsforhold-aarsak.svar.permittert" },
              { id: "faktum.arbeidsforhold-aarsak.svar.kontrakt-utgaatt" },
              { id: "faktum.arbeidsforhold-aarsak.svar.sagt-opp-selv" },
              { id: "faktum.arbeidsforhold-aarsak.svar.redusert-arbeidstid" },
              { id: "faktum.arbeidsforhold-aarsak.svar.konkurs-arbeidsgiver" },
              { id: "faktum.arbeidsforhold-aarsak.svar.avskjediget" },
              { id: "faktum.arbeidsforhold-aarsak.svar.ikke-endret" },
            ],
            subFaktum: [
              {
                id: "faktum.arbeidsforhold-varighet",
                type: "periode",
                requiredAnswerId: [
                  "faktum.arbeidsforhold-aarsak.svar.sagt-opp-av-arbeidsgiver",
                  "faktum.arbeidsforhold-aarsak.svar.kontrakt-utgaatt",
                  "faktum.arbeidsforhold-aarsak.svar.sagt-opp-selv",
                  "faktum.arbeidsforhold-aarsak.svar.redusert-arbeidstid",
                  "faktum.arbeidsforhold-aarsak.svar.konkurs-arbeidsgiver",
                  "faktum.arbeidsforhold-aarsak.svar.avskjediget",
                ],
                answers: [],
                subFaktum: [],
              },
              {
                id: "faktum.arbeidsforhold-ekstra-opplysninger",
                type: "flervalg",
                requiredAnswerId: ["faktum.arbeidsforhold-aarsak.svar.sagt-opp-av-arbeidsgiver"],
                answers: [
                  { id: "faktum.arbeidsforhold-ekstra-opplysninger.svar.laerling" },
                  { id: "faktum.arbeidsforhold-ekstra-opplysninger.svar.flere-arbeidsforhold" },
                ],
                subFaktum: [],
              },
              {
                id: "faktum.arbeidsforhold-arbeidstid-timer-i-uken",
                type: "double",
                requiredAnswerId: ["faktum.arbeidsforhold-aarsak.svar.sagt-opp-av-arbeidsgiver"],
                answers: [],
                subFaktum: [],
              },
              {
                id: "faktum.arbeidsforhold-arbeidstid-vet-ikke",
                type: "flervalg",
                requiredAnswerId: ["faktum.arbeidsforhold-aarsak.svar.sagt-opp-av-arbeidsgiver"],
                answers: [{ id: "faktum.arbeidsforhold-arbeidstid-vet-ikke.svar.beregn-for-meg" }],
                subFaktum: [],
              },
            ],
          },
        ],
        answers: [],
      },
    ],
  },
];
