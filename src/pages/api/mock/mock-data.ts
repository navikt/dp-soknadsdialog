import { Faktumtype } from "../types";

export interface MockDataSeksjon {
  id: string;
  faktum: MockDataFaktum[];
}

export type MockDataFaktum = MockDataBaseFaktum | MockDataGeneratorFaktum | MockDataValgFaktum;

export interface MockDataBaseFaktum {
  id: string;
  type: Faktumtype;
}

export interface MockDataGeneratorFaktum extends MockDataBaseFaktum {
  type: "generator";
  faktum: MockDataFaktum[];
}

export interface MockDataValgFaktum extends MockDataBaseFaktum {
  type: "boolean" | "valg" | "flervalg" | "dropdown";
  subFaktum: MockDataSubFaktum[];
  answerOptions: MockDataAnswerOption[];
}

export interface MockDataAnswerOption {
  id: string;
  documentRequiredId?: string[];
}

export type MockDataSubFaktum = MockDataFaktum & {
  requiredAnswerId: string[];
};

export interface MockDataDokumentFaktum {
  id: string;
}

const documentFakta: MockDataDokumentFaktum[] = [
  { id: "dokument-faktum.arbeidsforhold-timelister-rotasjon" },
];

export const mockSeksjoner: MockDataSeksjon[] = [
  {
    id: "korona-fortsatt-rett",
    faktum: [
      {
        id: "faktum.oppbrukt-dagpengeperiode",
        type: "boolean",
        answerOptions: [
          { id: "faktum.oppbrukt-dagpengeperiode.svar.ja" },
          { id: "faktum.oppbrukt-dagpengeperiode.svar.nei" },
        ],
        subFaktum: [
          {
            id: "faktum.onsker-fortsette-avsluttet-periode",
            type: "boolean",
            requiredAnswerId: ["faktum.oppbrukt-dagpengeperiode.svar.ja"],
            answerOptions: [
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
        answerOptions: [{ id: "faktum.hel-deltid.svar.ja" }, { id: "faktum.hel-deltid.svar.nei" }],
        subFaktum: [
          {
            id: "faktum.kun-deltid-aarsak",
            type: "flervalg",
            requiredAnswerId: ["faktum.hel-deltid.svar.nei"],
            answerOptions: [
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
          },
        ],
      },
      {
        id: "faktum.hele-norge",
        type: "boolean",
        answerOptions: [{ id: "faktum.hele-norge.svar.ja" }, { id: "faktum.hele-norge.svar.nei" }],
        subFaktum: [
          {
            id: "faktum.ikke-hele-norge",
            type: "flervalg",
            requiredAnswerId: ["faktum.hele-norge.svar.nei"],
            answerOptions: [
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
        answerOptions: [
          { id: "faktum.alle-typer-arbeid.svar.ja" },
          { id: "faktum.alle-typer-arbeid.svar.nei" },
        ],
        subFaktum: [
          {
            id: "faktum.ikke-denne-type-arbeid",
            type: "tekst",
            requiredAnswerId: ["faktum.alle-typer-arbeid.svar.nei"],
          },
        ],
      },
      {
        id: "faktum.ethvert-arbeid",
        type: "boolean",
        answerOptions: [
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
      },
      {
        id: "faktum.fast-arbeidstid",
        type: "valg",
        answerOptions: [
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
        faktum: [
          {
            id: "faktum.navn-bedrift",
            type: "tekst",
          },
          {
            id: "faktum.arbeidsforhold-land",
            type: "dropdown",
            answerOptions: [], // liste over alle land? generere maskinelt? quiz?
            subFaktum: [],
          },
          {
            id: "faktum.arbeidsforhold-aarsak",
            type: "valg",
            answerOptions: [
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
              },
              {
                id: "faktum.arbeidsforhold-ekstra-opplysninger-laerlig",
                type: "flervalg",
                requiredAnswerId: [
                  "faktum.arbeidsforhold-aarsak.svar.sagt-opp-av-arbeidsgiver",
                  "faktum.arbeidsforhold-aarsak.svar.permittert",
                ],
                answerOptions: [{ id: "faktum.arbeidsforhold-ekstra-opplysninger.svar.laerling" }],
                subFaktum: [],
              },
              {
                id: "faktum.arbeidsforhold-ekstra-opplysninger-fiskeindustri",
                type: "flervalg",
                requiredAnswerId: ["faktum.arbeidsforhold-aarsak.svar.permittert"],
                answerOptions: [
                  { id: "faktum.arbeidsforhold-ekstra-opplysninger.svar.fiskeindustri" },
                ],
                subFaktum: [],
              },
              {
                id: "faktum.arbeidsforhold-ekstra-opplysninger-flere-arbeidsforhold",
                type: "flervalg",
                requiredAnswerId: [
                  "faktum.arbeidsforhold-aarsak.svar.sagt-opp-av-arbeidsgiver",
                  "faktum.arbeidsforhold-aarsak.svar.permittert",
                ],
                answerOptions: [
                  { id: "faktum.arbeidsforhold-ekstra-opplysninger.svar.flere-arbeidsforhold" },
                ],
                subFaktum: [
                  {
                    id: "faktum.arbeidsforhold-arbeidstid-timer-i-uken-alle-forhold",
                    type: "double",
                    requiredAnswerId: [
                      "faktum.arbeidsforhold-ekstra-opplysninger.svar.flere-arbeidsforhold",
                    ],
                  },
                ],
              },
              {
                id: "faktum.arbeidsforhold-arbeidstid-timer-i-uken",
                type: "double",
                requiredAnswerId: [
                  "faktum.arbeidsforhold-aarsak.svar.sagt-opp-av-arbeidsgiver",
                  "faktum.arbeidsforhold-aarsak.svar.permittert",
                ],
              },
              {
                id: "faktum.aarsak-til-oppsigelse-fra-arbeidsgiver",
                type: "tekst",
                requiredAnswerId: ["faktum.arbeidsforhold-aarsak.svar.sagt-opp-av-arbeidsgiver"],
              },
              {
                id: "faktum.tilbud-annen-stilling-annet-sted",
                type: "boolean",
                requiredAnswerId: ["faktum.arbeidsforhold-aarsak.svar.sagt-opp-av-arbeidsgiver"],
                answerOptions: [
                  { id: "faktum.tilbud-annen-stilling-annet-sted.svar.ja" },
                  { id: "faktum.tilbud-annen-stilling-annet-sted.svar.nei" },
                ],
                subFaktum: [],
              },
              {
                id: "faktum.arbeids-skift-turnus-rotasjon",
                type: "valg",
                requiredAnswerId: ["faktum.arbeidsforhold-aarsak.svar.sagt-opp-av-arbeidsgiver"],
                answerOptions: [
                  { id: "faktum.arbeids-skift-turnus-rotasjon.svar.nei" },
                  { id: "faktum.arbeids-skift-turnus-rotasjon.svar.ja-skift-turnus" },
                  {
                    id: "faktum.arbeids-skift-turnus-rotasjon.svar.ja-rotasjon",
                    documentRequiredId: ["dokument-faktum.arbeidsforhold-timelister-rotasjon"],
                  },
                ],
                subFaktum: [
                  {
                    id: "faktum.arbeidsforhold-rotasjon-antall-arbeidsdager",
                    type: "int",
                    requiredAnswerId: ["faktum.arbeids-skift-turnus-rotasjon.svar.ja-rotasjon"],
                  },
                  {
                    id: "faktum.arbeidsforhold-rotasjon-antall-fridager",
                    type: "int",
                    requiredAnswerId: ["faktum.arbeids-skift-turnus-rotasjon.svar.ja-rotasjon"],
                  },
                  {
                    id: "faktum.arbeidsforhold-rotasjon-antall-fridager",
                    type: "int",
                    requiredAnswerId: ["faktum.arbeids-skift-turnus-rotasjon.svar.ja-rotasjon"],
                  },
                ],
              },
              {
                id: "faktum.midlertidig-arbeidsforhold-med-sluttdato",
                type: "valg",
                requiredAnswerId: ["faktum.arbeidsforhold-aarsak.svar.permittert"],
                answerOptions: [
                  { id: "faktum.midlertidig-arbeidsforhold-med-sluttdato.svar.nei-fast-arbeid" },
                  { id: "faktum.midlertidig-arbeidsforhold-med-sluttdato.svar.ja" },
                  {
                    id: "faktum.midlertidig-arbeidsforhold-med-sluttdato.svar.vet-ikke",
                  },
                ],
                subFaktum: [
                  {
                    id: "faktum.midlertidig-arbeidsforhold-sluttdato",
                    type: "localdate",
                    requiredAnswerId: ["faktum.midlertidig-arbeidsforhold-med-sluttdato.svar.ja"],
                  },
                ],
              },
              {
                id: "faktum.arbeidsforhold-permitert",
                type: "generator",
                requiredAnswerId: ["faktum.arbeidsforhold-aarsak.svar.permittert"],
                faktum: [
                  {
                    id: "faktum.arbeidsforhold-permitteringsperiode",
                    type: "periode",
                  },
                  {
                    id: "faktum.arbeidsforhold-permitteringgrad",
                    type: "int",
                  },
                ],
              },
              {
                id: "faktum.arbeidsforhold-lønnsplinkt-arbeidsgiver",
                type: "periode",
                requiredAnswerId: ["faktum.arbeidsforhold-aarsak.svar.permittert"],
              },
            ],
          },
        ],
      },
    ],
  },
];
