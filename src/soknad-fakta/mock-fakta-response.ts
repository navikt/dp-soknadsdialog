import { GeneratorFaktumType, PrimitivFaktumType, ValgFaktumType } from "../types/faktum.types";

export type QuizFaktumSvar = string | string[] | boolean | number;

export interface QuizBaseFaktum {
  id: string;
  beskrivendeId: string;
  gyldigeValg?: string[];
}

export interface QuizFaktum extends QuizBaseFaktum {
  type: PrimitivFaktumType | ValgFaktumType;
  svar?: QuizFaktumSvar;
}

export interface QuizGeneratorFaktum extends QuizBaseFaktum {
  type: GeneratorFaktumType;
  svar?: QuizFaktum[][];
  templates?: GeneratorTemplate[];
}

interface GeneratorTemplate {
  id: string;
  type: PrimitivFaktumType | ValgFaktumType;
  beskrivendeId: string;
}

export const mockFakta: (QuizFaktum | QuizGeneratorFaktum)[] = [
  {
    id: "1",
    type: "boolean",
    beskrivendeId: "faktum.hel-deltid",
  },
  {
    id: "2",
    type: "flervalg",
    beskrivendeId: "faktum.kun-deltid-aarsak",
    gyldigeValg: [
      "faktum.kun-deltid-aarsak.svar.redusert-helse",
      "faktum.kun-deltid-aarsak.svar.omsorg-baby",
      "faktum.kun-deltid-aarsak.svar.eneansvar-barn",
      "faktum.kun-deltid-aarsak.svar.omsorg-barn-spesielle-behov",
      "faktum.kun-deltid-aarsak.svar.skift-turnus",
      "faktum.kun-deltid-aarsak.svar.annen-situasjon",
    ],
  },
  {
    id: "3",
    type: "int",
    beskrivendeId: "faktum.kun-deltid-aarsak-antall-timer",
  },
  {
    id: "4",
    type: "boolean",
    beskrivendeId: "faktum.hele-norge",
  },
  {
    id: "5",
    type: "flervalg",
    beskrivendeId: "faktum.ikke-hele-norge",
    gyldigeValg: [
      "faktum.ikke-hele-norge.svar.redusert-helse",
      "faktum.ikke-hele-norge.svar.omsorg-baby",
      "faktum.ikke-hele-norge.svar.eneansvar-barn",
      "faktum.ikke-hele-norge.svar.omsorg-barn-spesielle-behov",
      "faktum.ikke-hele-norge.svar.utenfor-naeromraadet",
      "faktum.ikke-hele-norge.svar.annen-situasjon",
    ],
  },
  {
    id: "6",
    type: "boolean",
    beskrivendeId: "faktum.alle-typer-arbeid",
  },
  {
    id: "7",
    type: "tekst",
    beskrivendeId: "faktum.ikke-denne-type-arbeid",
  },
  {
    id: "8",
    type: "boolean",
    beskrivendeId: "faktum.ethvert-arbeid",
  },
  {
    id: "2001",
    type: "envalg",
    beskrivendeId: "faktum.utdanning",
    gyldigeValg: [
      "faktum.utdanning.svar.nei",
      "faktum.utdanning.svar.nei-men-siste-6-mnd",
      "faktum.utdanning.svar.ja",
    ],
  },
  {
    id: "3001",
    type: "boolean",
    beskrivendeId: "faktum.driver-du-egen-naering",
  },
  {
    id: "3004",
    type: "double",
    beskrivendeId: "faktum.egen-naering-arbeidstimer",
  },
  {
    id: "3005",
    type: "boolean",
    beskrivendeId: "faktum.driver-du-eget-gaardsbruk",
  },
  {
    id: "3006",
    type: "int",
    beskrivendeId: "faktum-eget-gaardsbruk-organisasjonsnummer",
  },
  {
    id: "3007",
    type: "flervalg",
    beskrivendeId: "faktum-eget-gaardsbruk-type-gaardsbruk",
    gyldigeValg: [
      "faktum-eget-gaardsbruk-type-gaardsbruk.faktum.eget-gaardsbruk-type-gaardsbruk.svar.dyr",
      "faktum-eget-gaardsbruk-type-gaardsbruk.faktum.eget-gaardsbruk-type-gaardsbruk.svar.jord",
      "faktum-eget-gaardsbruk-type-gaardsbruk.faktum.eget-gaardsbruk-type-gaardsbruk.svar.skog",
      "faktum-eget-gaardsbruk-type-gaardsbruk.faktum.eget-gaardsbruk-type-gaardsbruk.svar.annet",
    ],
  },
  {
    id: "3008",
    type: "flervalg",
    beskrivendeId: "faktum-eget-gaardsbruk-hvem-eier",
    gyldigeValg: [
      "faktum-eget-gaardsbruk-hvem-eier.faktum.eget-gaardsbruk-hvem-eier.svar.selv",
      "faktum-eget-gaardsbruk-hvem-eier.faktum.eget-gaardsbruk-hvem-eier.svar.ektefelle-samboer",
      "faktum-eget-gaardsbruk-hvem-eier.faktum.eget-gaardsbruk-hvem-eier.svar.andre",
    ],
  },
  {
    id: "3009",
    type: "double",
    beskrivendeId: "faktum-eget-gaardsbruk-arbeidstimer",
  },
  {
    id: "3010",
    type: "envalg",
    beskrivendeId: "faktum-eget-gaardsbruk-arbeidsaar",
    gyldigeValg: [
      "faktum-eget-gaardsbruk-arbeidsaar.svar.2022",
      "faktum-eget-gaardsbruk-arbeidsaar.svar.2021",
      "faktum-eget-gaardsbruk-arbeidsaar.svar.2020",
      "faktum-eget-gaardsbruk-arbeidsaar.svar.2019",
      "faktum-eget-gaardsbruk-arbeidsaar.svar.2018",
    ],
  },
  {
    id: "3011",
    type: "tekst",
    beskrivendeId: "faktum-eget-gaardsbruk-arbeidstimer-beregning",
  },
  {
    id: "4001",
    type: "tekst",
    beskrivendeId: "faktum.tilleggsopplysninger",
  },
  {
    id: "5001",
    type: "flervalg",
    beskrivendeId: "faktum.andre-ytelser",
    gyldigeValg: [
      "faktum.andre-ytelser.svar.pensjon-offentlig-tjenestepensjon",
      "faktum.andre-ytelser.svar.arbeidsloshet-garantikassen-for-fiskere",
      "faktum.andre-ytelser.svar.garantilott-garantikassen-for-fiskere",
      "faktum.andre-ytelser.svar.etterlonn-arbeidsgiver",
      "faktum.andre-ytelser.svar.vartpenger",
      "faktum.andre-ytelser.svar.dagpenger-annet-eos-land",
      "faktum.andre-ytelser.svar.annen-ytelse",
      "faktum.andre-ytelser.svar.nei",
    ],
  },
  {
    id: "5002",
    type: "tekst",
    beskrivendeId: "faktum.tjenestepensjon-hvem-utbetaler-hvilken-periode",
  },
  {
    id: "5003",
    type: "tekst",
    beskrivendeId: "faktum.arbeidsloshet-garantikassen-for-fiskere-periode",
  },
  {
    id: "5004",
    type: "tekst",
    beskrivendeId: "faktum.garantilott-garantikassen-for-fiskere-periode",
  },
  {
    id: "5005",
    type: "tekst",
    beskrivendeId: "faktum.etterlonn-hvem-utbetaler-hvilken-periode",
  },
  {
    id: "5006",
    type: "tekst",
    beskrivendeId: "faktum.vartpenger-hvem-utbetaler-hvilken-periode",
  },
  {
    id: "5007",
    type: "land",
    beskrivendeId: "faktum.dagpenger-annet-eos-land",
  },
  {
    id: "5008",
    type: "tekst",
    beskrivendeId: "faktum.annen-ytelse-hvilken",
  },
  {
    id: "5009",
    type: "tekst",
    beskrivendeId: "faktum.annen-ytelse-hvem-utebetaler-hvilken-periode",
  },
  {
    id: "5010",
    type: "boolean",
    beskrivendeId: "faktum.utbetaling-okonomisk-gode-tidligere-arbeidsgiver",
  },
  {
    id: "5011",
    type: "tekst",
    beskrivendeId: "faktum.okonomisk-gode-tidligere-arbeidsgiver-hva-omfatter-avtalen",
  },
  {
    id: "6001",
    type: "land",
    beskrivendeId: "faktum.hvilket-land-bor-du-i",
  },
  {
    id: "7001",
    type: "boolean",
    beskrivendeId: "faktum.avtjent-militaer-sivilforsvar-tjeneste-siste-12-mnd",
  },
  {
    id: "8001",
    type: "localdate",
    beskrivendeId: "faktum.dagpenger-soknadsdato",
  },
  {
    id: "8002",
    type: "envalg",
    beskrivendeId: "faktum.fast-arbeidstid",
    gyldigeValg: [
      "faktum.fast-arbeidstid.svar.ja-fast",
      "faktum.fast-arbeidstid.svar.nei-varierende",
      "faktum.fast-arbeidstid.svar.kombinasjon",
      "faktum.fast-arbeidstid.svar.ingen-passer",
    ],
  },
  {
    id: "9001",
    type: "boolean",
    beskrivendeId: "faktum.eos-arbeid-siste-36-mnd",
  },
  {
    id: "10001",
    type: "boolean",
    beskrivendeId: "faktum.oppbrukt-dagpengeperiode",
  },
  {
    id: "10002",
    type: "boolean",
    beskrivendeId: "faktum.onsker-fortsette-avsluttet-periode",
  },
  {
    id: "1001",
    type: "generator",
    beskrivendeId: "faktum.barn-liste",
    svar: [
      [
        {
          id: "1002.1",
          type: "tekst",
          beskrivendeId: "faktum.barn-fornavn-mellomnavn",
          svar: "VAKKER",
        },
        {
          id: "1003.1",
          type: "tekst",
          beskrivendeId: "faktum.barn-etternavn",
          svar: "VEGGPRYD",
        },
        {
          id: "1004.1",
          type: "localdate",
          beskrivendeId: "faktum.barn-foedselsdato",
          svar: "2013-08-16",
        },
        {
          id: "1005.1",
          type: "land",
          beskrivendeId: "faktum.barn-statsborgerskap",
          svar: "NOR",
        },
      ],
      [
        {
          id: "1002.2",
          type: "tekst",
          beskrivendeId: "faktum.barn-fornavn-mellomnavn",
          svar: "STERK",
        },
        {
          id: "1003.2",
          type: "tekst",
          beskrivendeId: "faktum.barn-etternavn",
          svar: "BAMSE",
        },
        {
          id: "1004.2",
          type: "localdate",
          beskrivendeId: "faktum.barn-foedselsdato",
          svar: "2007-04-21",
        },
        {
          id: "1005.2",
          type: "land",
          beskrivendeId: "faktum.barn-statsborgerskap",
          svar: "NOR",
        },
      ],
    ],
    templates: [
      {
        id: "1002",
        type: "tekst",
        beskrivendeId: "faktum.barn-fornavn-mellomnavn",
      },
      {
        id: "1003",
        type: "tekst",
        beskrivendeId: "faktum.barn-etternavn",
      },
      {
        id: "1004",
        type: "localdate",
        beskrivendeId: "faktum.barn-foedselsdato",
      },
      {
        id: "1005",
        type: "land",
        beskrivendeId: "faktum.barn-statsborgerskap",
      },
      {
        id: "1006",
        type: "boolean",
        beskrivendeId: "faktum.forsoerger-du-barnet",
      },
      {
        id: "1007",
        type: "boolean",
        beskrivendeId: "faktum.barn-aarsinntekt-over-1g",
      },
      {
        id: "1008",
        type: "int",
        beskrivendeId: "faktum.barn-inntekt",
      },
    ],
  },
  {
    id: "3002",
    type: "generator",
    beskrivendeId: "faktum.egen-naering-organisasjonsnummer-liste",
    templates: [
      {
        id: "3003",
        type: "int",
        beskrivendeId: "faktum.egen-naering-organisasjonsnummer",
      },
    ],
  },
  {
    id: "8003",
    type: "generator",
    beskrivendeId: "faktum.arbeidsforhold",
    templates: [
      {
        id: "8004",
        type: "tekst",
        beskrivendeId: "faktum.navn-bedrift",
      },
      {
        id: "8005",
        type: "land",
        beskrivendeId: "faktum.arbeidsforhold-land",
      },
      {
        id: "8006",
        type: "envalg",
        beskrivendeId: "faktum.arbeidsforhold-aarsak",
      },
      {
        id: "8007",
        type: "periode",
        beskrivendeId: "faktum.arbeidsforhold-varighet",
      },
      {
        id: "8008",
        type: "flervalg",
        beskrivendeId: "faktum.arbeidsforhold-ekstra-opplysninger-laerlig",
      },
      {
        id: "8009",
        type: "flervalg",
        beskrivendeId: "faktum.arbeidsforhold-ekstra-opplysninger-fiskeindustri",
      },
      {
        id: "8010",
        type: "flervalg",
        beskrivendeId: "faktum.arbeidsforhold-ekstra-opplysninger-flere-arbeidsforhold",
      },
      {
        id: "8011",
        type: "double",
        beskrivendeId: "faktum.arbeidsforhold-arbeidstid-timer-i-uken-alle-forhold",
      },
      {
        id: "8012",
        type: "double",
        beskrivendeId: "faktum.arbeidsforhold-arbeidstid-timer-i-uken",
      },
      {
        id: "8013",
        type: "tekst",
        beskrivendeId: "faktum.arbeidsforhold-aarsak-til-oppsigelse-fra-arbeidsgiver",
      },
      {
        id: "8014",
        type: "tekst",
        beskrivendeId: "faktum.arbeidsforhold-aarsak-til-avskjedigelse-fra-arbeidsgiver",
      },
      {
        id: "8015",
        type: "boolean",
        beskrivendeId: "faktum.tilbud-annen-stilling-annet-sted-samme-arbeidsgiver",
      },
      {
        id: "8016",
        type: "boolean",
        beskrivendeId: "faktum.tilbud-forsette-samme-arbeidsgiver",
      },
      {
        id: "8017",
        type: "envalg",
        beskrivendeId: "faktum.arbeids-skift-turnus-rotasjon",
      },
      {
        id: "8018",
        type: "int",
        beskrivendeId: "faktum.arbeidsforhold-rotasjon-antall-arbeidsdager",
      },
      {
        id: "8019",
        type: "int",
        beskrivendeId: "faktum.arbeidsforhold-rotasjon-antall-fridager",
      },
      {
        id: "8020",
        type: "envalg",
        beskrivendeId: "faktum.midlertidig-arbeidsforhold-med-sluttdato",
      },
      {
        id: "8021",
        type: "localdate",
        beskrivendeId: "faktum.midlertidig-arbeidsforhold-sluttdato",
      },
      {
        id: "8022",
        type: "periode",
        beskrivendeId: "faktum.arbeidsforhold-permitteringsperiode",
      },
      {
        id: "8023",
        type: "int",
        beskrivendeId: "faktum.arbeidsforhold-permitteringgrad",
      },
      {
        id: "8024",
        type: "periode",
        beskrivendeId: "faktum.arbeidsforhold-lonnsplinkt-arbeidsgiver",
      },
      {
        id: "8025",
        type: "tekst",
        beskrivendeId: "faktum.aarsak-til-sagt-opp-selv",
      },
      {
        id: "8026",
        type: "tekst",
        beskrivendeId: "faktum.arbeidsforhold-arbeidsgiver-konkurs-navn-bostyrer",
      },
      {
        id: "8027",
        type: "envalg",
        beskrivendeId: "faktum.arbeidsforhold-dagpenger-og-forskudd-lonnsgarantimidler",
      },
      {
        id: "8028",
        type: "boolean",
        beskrivendeId: "faktum.arbeidsforhold-godta-nav-trekk-direkte-lonnsgaranti",
      },
      {
        id: "8029",
        type: "envalg",
        beskrivendeId: "faktum.arbeidsforhold-sok-lonnsgarantimidler",
      },
      {
        id: "8030",
        type: "envalg",
        beskrivendeId: "faktum.arbeidsforhold-lonnsgaranti-dekker-krav",
      },
      {
        id: "8031",
        type: "boolean",
        beskrivendeId: "faktum.arbeidsforhold-godta-trekk-direkte-konkursbo",
      },
      {
        id: "8032",
        type: "boolean",
        beskrivendeId: "faktum.arbeidsforhold-utbetalt-lonn-etter-konkurs",
      },
      {
        id: "8033",
        type: "localdate",
        beskrivendeId: "faktum-arbeidsforhold-konkurs-siste-dag-lonn",
      },
      {
        id: "8034",
        type: "tekst",
        beskrivendeId: "faktum.arbeidsforhold-tillegsinformasjon",
      },
    ],
  },
  {
    id: "9002",
    type: "generator",
    beskrivendeId: "faktum.eos-arbeidsforhold",
    templates: [
      {
        id: "9003",
        type: "tekst",
        beskrivendeId: "faktum.eos-arbeidsforhold-arbeidsgivernavn",
      },
      {
        id: "9004",
        type: "land",
        beskrivendeId: "faktum.eos-arbeidsforhold-land",
      },
      {
        id: "9005",
        type: "tekst",
        beskrivendeId: "faktum.eos-arbeidsforhold-personnummer",
      },
      {
        id: "9006",
        type: "periode",
        beskrivendeId: "faktum.eos-arbeidsforhold-varighet",
      },
    ],
  },
];
