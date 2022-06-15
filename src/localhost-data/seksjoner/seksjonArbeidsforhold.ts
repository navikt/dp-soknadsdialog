import { QuizSeksjon } from "../../types/quiz.types";
import { gyldigeLand } from "./seksjonBostedsland";

export const seksjonArbeidsforhold: QuizSeksjon = {
  fakta: [
    {
      id: "8001",
      svar: "2022-05-06",
      type: "localdate",
      readOnly: false,
      beskrivendeId: "faktum.dagpenger-soknadsdato",
    },
    {
      id: "8002",
      svar: "faktum.type-arbeidstid.svar.fast",
      type: "envalg",
      readOnly: false,
      gyldigeValg: [
        "faktum.type-arbeidstid.svar.fast",
        "faktum.type-arbeidstid.svar.varierende",
        "faktum.type-arbeidstid.svar.kombinasjon",
        "faktum.type-arbeidstid.svar.ingen-passer",
      ],
      beskrivendeId: "faktum.type-arbeidstid",
    },
    {
      id: "8003",
      type: "generator",
      svar: [
        [
          {
            id: "8004.1",
            type: "tekst",
            svar: "Iskremfabrikken",
            readOnly: false,
            beskrivendeId: "faktum.arbeidsforhold.navn-bedrift",
          },
          {
            id: "8005.1",
            type: "land",
            svar: "NOR",
            readOnly: false,
            gyldigeLand,
            grupper: [
              {
                land: ["SJM", "NOR"],
                gruppeId: "faktum.hvilket-land-bor-du-i.gruppe.norge-jan-mayen",
              },
            ],
            beskrivendeId: "faktum.arbeidsforhold.land",
          },
        ],
        [
          {
            id: "8004.2",
            type: "tekst",
            svar: "Narvesen",
            readOnly: false,
            beskrivendeId: "faktum.arbeidsforhold.navn-bedrift",
          },
          {
            id: "8005.2",
            type: "land",
            svar: "DKK",
            readOnly: false,
            gyldigeLand,
            grupper: [
              {
                land: ["SJM", "NOR"],
                gruppeId: "faktum.hvilket-land-bor-du-i.gruppe.norge-jan-mayen",
              },
            ],
            beskrivendeId: "faktum.arbeidsforhold.land",
          },
        ],
      ],
      templates: [
        {
          id: "8004",
          type: "tekst",
          beskrivendeId: "faktum.arbeidsforhold.navn-bedrift",
        },
        {
          id: "8005",
          type: "land",
          beskrivendeId: "faktum.arbeidsforhold.land",
        },
        {
          id: "8006",
          type: "envalg",
          beskrivendeId: "faktum.arbeidsforhold.endret",
        },
        {
          id: "8007",
          type: "boolean",
          beskrivendeId: "faktum.arbeidsforhold.kjent-antall-timer-jobbet",
        },
        {
          id: "8008",
          type: "double",
          beskrivendeId: "faktum.arbeidsforhold.antall-timer-jobbet",
        },
        {
          id: "8048",
          type: "boolean",
          beskrivendeId: "faktum.arbeidsforhold.har-tilleggsopplysninger",
        },
        {
          id: "8009",
          type: "tekst",
          beskrivendeId: "faktum.arbeidsforhold.tilleggsopplysninger",
        },
        {
          id: "8010",
          type: "localdate",
          beskrivendeId: "faktum.arbeidsforhold.startdato-arbeidsforhold",
        },
        {
          id: "8011",
          type: "localdate",
          beskrivendeId: "faktum.arbeidsforhold.arbeidstid-redusert-fra-dato",
        },
        {
          id: "8012",
          type: "envalg",
          beskrivendeId: "faktum.arbeidsforhold.midlertidig-med-kontraktfestet-sluttdato",
        },
        {
          id: "8013",
          type: "localdate",
          beskrivendeId: "faktum.arbeidsforhold.kontraktfestet-sluttdato",
        },
        {
          id: "8014",
          type: "localdate",
          beskrivendeId: "faktum.arbeidsforhold.midlertidig-arbeidsforhold-oppstartsdato",
        },
        {
          id: "8015",
          type: "boolean",
          beskrivendeId: "faktum.arbeidsforhold.permittertert-fra-fiskeri-naering",
        },
        {
          id: "8016",
          type: "periode",
          beskrivendeId: "faktum.arbeidsforhold.varighet",
        },
        {
          id: "8017",
          type: "boolean",
          beskrivendeId: "faktum.arbeidsforhold.vet-du-antall-timer-foer-mistet-jobb",
        },
        {
          id: "8018",
          type: "boolean",
          beskrivendeId: "faktum.arbeidsforhold.vet-du-antall-timer-foer-konkurs",
        },
        {
          id: "8019",
          type: "boolean",
          beskrivendeId: "faktum.arbeidsforhold.vet-du-antall-timer-foer-kontrakt-utgikk",
        },
        {
          id: "8020",
          type: "boolean",
          beskrivendeId: "faktum.arbeidsforhold.vet-du-antall-timer-foer-du-sa-opp",
        },
        {
          id: "8021",
          type: "boolean",
          beskrivendeId: "faktum.arbeidsforhold.vet-du-antall-timer-foer-redusert-arbeidstid",
        },
        {
          id: "8022",
          type: "boolean",
          beskrivendeId: "faktum.arbeidsforhold.vet-du-antall-timer-foer-permittert",
        },
        {
          id: "8023",
          type: "double",
          beskrivendeId: "faktum.arbeidsforhold.antall-timer-dette-arbeidsforhold",
        },
        {
          id: "8024",
          type: "periode",
          beskrivendeId: "faktum.arbeidsforhold.permittert-periode",
        },
        {
          id: "8025",
          type: "int",
          beskrivendeId: "faktum.arbeidsforhold.permittert-prosent",
        },
        {
          id: "8026",
          type: "boolean",
          beskrivendeId: "faktum.arbeidsforhold.vet-du-lonnsplikt-periode",
        },
        {
          id: "8027",
          type: "periode",
          beskrivendeId: "faktum.arbeidsforhold.naar-var-lonnsplikt-periode",
        },
        {
          id: "8028",
          type: "tekst",
          beskrivendeId: "faktum.arbeidsforhold.aarsak-til-du-sa-opp",
        },
        {
          id: "8029",
          type: "boolean",
          beskrivendeId: "faktum.arbeidsforhold.tilbud-om-forlengelse-eller-annen-stilling",
        },
        {
          id: "8030",
          type: "envalg",
          beskrivendeId: "faktum.arbeidsforhold.svar-paa-forlengelse-eller-annen-stilling",
        },
        {
          id: "8031",
          type: "tekst",
          beskrivendeId: "faktum.arbeidsforhold.aarsak-til-ikke-akseptert-tilbud",
        },
        {
          id: "8032",
          type: "boolean",
          beskrivendeId: "faktum.arbeidsforhold.soke-forskudd-lonnsgarantimidler",
        },
        {
          id: "8033",
          type: "boolean",
          beskrivendeId:
            "faktum.arbeidsforhold.soke-forskudd-lonnsgarantimidler-i-tillegg-til-dagpenger",
        },
        {
          id: "8034",
          type: "boolean",
          beskrivendeId:
            "faktum.arbeidsforhold.godta-trekk-fra-nav-av-forskudd-fra-lonnsgarantimidler",
        },
        {
          id: "8035",
          type: "envalg",
          beskrivendeId: "faktum.arbeidsforhold.har-sokt-om-lonnsgarantimidler",
        },
        {
          id: "8036",
          type: "envalg",
          beskrivendeId: "faktum.arbeidsforhold.dekker-lonnsgarantiordningen-lonnskravet-ditt",
        },
        {
          id: "8037",
          type: "boolean",
          beskrivendeId: "faktum.arbeidsforhold.utbetalt-lonn-etter-konkurs",
        },
        {
          id: "8038",
          type: "localdate",
          beskrivendeId: "faktum.arbeidsforhold.siste-dag-utbetalt-for-konkurs",
        },
        {
          id: "8039",
          type: "tekst",
          beskrivendeId: "faktum.arbeidsforhold.hva-er-aarsak-til-avskjediget",
        },
        {
          id: "8040",
          type: "tekst",
          beskrivendeId: "faktum.arbeidsforhold.vet-du-aarsak-til-sagt-opp-av-arbeidsgiver",
        },
        {
          id: "8041",
          type: "tekst",
          beskrivendeId: "faktum.arbeidsforhold.vet-du-aarsak-til-redusert-arbeidstid",
        },
        {
          id: "8042",
          type: "envalg",
          beskrivendeId: "faktum.arbeidsforhold.midlertidig-arbeidsforhold-med-sluttdato",
        },
        {
          id: "8043",
          type: "boolean",
          beskrivendeId: "faktum.arbeidsforhold.tilbud-om-annen-stilling-eller-annet-sted-i-norge",
        },
        {
          id: "8044",
          type: "boolean",
          beskrivendeId: "faktum.arbeidsforhold.skift-eller-turnus",
        },
        {
          id: "8045",
          type: "boolean",
          beskrivendeId: "faktum.arbeidsforhold.rotasjon",
        },
        {
          id: "8046",
          type: "int",
          beskrivendeId: "faktum.arbeidsforhold.arbeidsdager-siste-rotasjon",
        },
        {
          id: "8047",
          type: "int",
          beskrivendeId: "faktum.arbeidsforhold.fridager-siste-rotasjon",
        },
      ],
      beskrivendeId: "faktum.arbeidsforhold",
    },
  ],
  beskrivendeId: "arbeidsforhold",
};
