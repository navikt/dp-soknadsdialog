import { QuizSeksjon } from "../types/quiz.types";

export interface QuizState {
  ferdig: boolean;
  seksjoner: QuizSeksjon[];
}

export const quizStateResponse: QuizState = {
  ferdig: false,
  seksjoner: [
    {
      fakta: [
        {
          id: "6001",
          svar: "BLZ",
          type: "land",
          beskrivendeId: "faktum.hvilket-land-bor-du-i",
          gyldigeValg: ["faktum.hvilket-land-bor-du-i.eos"],
        },
      ],
      beskrivendeId: "bostedsland",
    },
    {
      fakta: [
        {
          id: "10001",
          svar: "faktum.mottatt-dagpenger-siste-12-mnd.svar.ja",
          type: "envalg",
          gyldigeValg: [
            "faktum.mottatt-dagpenger-siste-12-mnd.svar.ja",
            "faktum.mottatt-dagpenger-siste-12-mnd.svar.nei",
            "faktum.mottatt-dagpenger-siste-12-mnd.svar.vet-ikke",
          ],
          beskrivendeId: "faktum.mottatt-dagpenger-siste-12-mnd",
        },
      ],
      beskrivendeId: "gjenopptak",
    },
    {
      fakta: [
        {
          id: "8001",
          svar: "2022-05-06",
          type: "localdate",
          beskrivendeId: "faktum.dagpenger-soknadsdato",
        },
        {
          id: "8002",
          svar: "faktum.type-arbeidstid.svar.fast",
          type: "envalg",
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
              gyldigeValg: ["faktum.hvilket-land-bor-du-i.eos"],
            },
            {
              id: "8006",
              type: "envalg",
              gyldigeValg: [
                "faktum.arbeidsforhold.endret.svar.ikke-endret",
                "faktum.arbeidsforhold.endret.svar.avskjediget",
                "faktum.arbeidsforhold.endret.svar.sagt-opp-av-arbeidsgiver",
                "faktum.arbeidsforhold.endret.svar.arbeidsgiver-konkurs",
                "faktum.arbeidsforhold.endret.svar.kontrakt-utgaatt",
                "faktum.arbeidsforhold.endret.svar.sagt-opp-selv",
                "faktum.arbeidsforhold.endret.svar.redusert-arbeidstid",
                "faktum.arbeidsforhold.endret.svar.permittert",
              ],
              beskrivendeId: "faktum.arbeidsforhold.endret",
            },
            {
              id: "8007",
              type: "boolean",
              beskrivendeId: "faktum.arbeidsforhold.kjent-antall-timer-jobbet",
              gyldigeValg: [
                "faktum.arbeidsforhold.kjent-antall-timer-jobbet.svar.ja",
                "faktum.arbeidsforhold.kjent-antall-timer-jobbet.svar.nei",
              ],
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
              gyldigeValg: [
                "faktum.arbeidsforhold.har-tilleggsopplysninger.svar.ja",
                "faktum.arbeidsforhold.har-tilleggsopplysninger.svar.nei",
              ],
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
              gyldigeValg: [
                "faktum.arbeidsforhold.midlertidig-med-kontraktfestet-sluttdato.svar.ja",
                "faktum.arbeidsforhold.midlertidig-med-kontraktfestet-sluttdato.svar.nei",
                "faktum.arbeidsforhold.midlertidig-med-kontraktfestet-sluttdato.svar.vet-ikke",
              ],
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
              gyldigeValg: [
                "faktum.arbeidsforhold.permittertert-fra-fiskeri-naering.svar.ja",
                "faktum.arbeidsforhold.permittertert-fra-fiskeri-naering.svar.nei",
              ],
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
              gyldigeValg: [
                "faktum.arbeidsforhold.vet-du-antall-timer-foer-mistet-jobb.svar.ja",
                "faktum.arbeidsforhold.vet-du-antall-timer-foer-mistet-jobb.svar.nei",
              ],
            },
            {
              id: "8018",
              type: "boolean",
              beskrivendeId: "faktum.arbeidsforhold.vet-du-antall-timer-foer-konkurs",
              gyldigeValg: [
                "faktum.arbeidsforhold.vet-du-antall-timer-foer-konkurs.svar.ja",
                "faktum.arbeidsforhold.vet-du-antall-timer-foer-konkurs.svar.nei",
              ],
            },
            {
              id: "8019",
              type: "boolean",
              beskrivendeId: "faktum.arbeidsforhold.vet-du-antall-timer-foer-kontrakt-utgikk",
              gyldigeValg: [
                "faktum.arbeidsforhold.vet-du-antall-timer-foer-kontrakt-utgikk.svar.ja",
                "faktum.arbeidsforhold.vet-du-antall-timer-foer-kontrakt-utgikk.svar.nei",
              ],
            },
            {
              id: "8020",
              type: "boolean",
              beskrivendeId: "faktum.arbeidsforhold.vet-du-antall-timer-foer-du-sa-opp",
              gyldigeValg: [
                "faktum.arbeidsforhold.vet-du-antall-timer-foer-du-sa-opp.svar.ja",
                "faktum.arbeidsforhold.vet-du-antall-timer-foer-du-sa-opp.svar.nei",
              ],
            },
            {
              id: "8021",
              type: "boolean",
              beskrivendeId: "faktum.arbeidsforhold.vet-du-antall-timer-foer-redusert-arbeidstid",
              gyldigeValg: [
                "faktum.arbeidsforhold.vet-du-antall-timer-foer-redusert-arbeidstid.svar.ja",
                "faktum.arbeidsforhold.vet-du-antall-timer-foer-redusert-arbeidstid.svar.nei",
              ],
            },
            {
              id: "8022",
              type: "boolean",
              beskrivendeId: "faktum.arbeidsforhold.vet-du-antall-timer-foer-permittert",
              gyldigeValg: [
                "faktum.arbeidsforhold.vet-du-antall-timer-foer-permittert.svar.ja",
                "faktum.arbeidsforhold.vet-du-antall-timer-foer-permittert.svar.nei",
              ],
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
              gyldigeValg: [
                "faktum.arbeidsforhold.vet-du-lonnsplikt-periode.svar.ja",
                "faktum.arbeidsforhold.vet-du-lonnsplikt-periode.svar.nei",
              ],
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
              gyldigeValg: [
                "faktum.arbeidsforhold.tilbud-om-forlengelse-eller-annen-stilling.svar.ja",
                "faktum.arbeidsforhold.tilbud-om-forlengelse-eller-annen-stilling.svar.nei",
              ],
            },
            {
              id: "8030",
              type: "envalg",
              gyldigeValg: [
                "faktum.arbeidsforhold.svar-paa-forlengelse-eller-annen-stilling.svar.ja",
                "faktum.arbeidsforhold.svar-paa-forlengelse-eller-annen-stilling.svar.nei",
                "faktum.arbeidsforhold.svar-paa-forlengelse-eller-annen-stilling.svar.ikke-svart",
              ],
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
              gyldigeValg: [
                "faktum.arbeidsforhold.soke-forskudd-lonnsgarantimidler.svar.ja",
                "faktum.arbeidsforhold.soke-forskudd-lonnsgarantimidler.svar.nei",
              ],
            },
            {
              id: "8033",
              type: "boolean",
              beskrivendeId:
                "faktum.arbeidsforhold.soke-forskudd-lonnsgarantimidler-i-tillegg-til-dagpenger",
              gyldigeValg: [
                "faktum.arbeidsforhold.soke-forskudd-lonnsgarantimidler-i-tillegg-til-dagpenger.svar.ja",
                "faktum.arbeidsforhold.soke-forskudd-lonnsgarantimidler-i-tillegg-til-dagpenger.svar.nei",
              ],
            },
            {
              id: "8034",
              type: "boolean",
              beskrivendeId:
                "faktum.arbeidsforhold.godta-trekk-fra-nav-av-forskudd-fra-lonnsgarantimidler",
              gyldigeValg: [
                "faktum.arbeidsforhold.godta-trekk-fra-nav-av-forskudd-fra-lonnsgarantimidler.svar.ja",
                "faktum.arbeidsforhold.godta-trekk-fra-nav-av-forskudd-fra-lonnsgarantimidler.svar.nei",
              ],
            },
            {
              id: "8035",
              type: "envalg",
              gyldigeValg: [
                "faktum.arbeidsforhold.har-sokt-om-lonnsgarantimidler.svar.nei",
                "faktum.arbeidsforhold.har-sokt-om-lonnsgarantimidler.svar.nei-men-skal",
                "faktum.arbeidsforhold.har-sokt-om-lonnsgarantimidler.svar.ja",
              ],
              beskrivendeId: "faktum.arbeidsforhold.har-sokt-om-lonnsgarantimidler",
            },
            {
              id: "8036",
              type: "envalg",
              gyldigeValg: [
                "faktum.arbeidsforhold.dekker-lonnsgarantiordningen-lonnskravet-ditt.svar.ja",
                "faktum.arbeidsforhold.dekker-lonnsgarantiordningen-lonnskravet-ditt.svar.nei",
                "faktum.arbeidsforhold.dekker-lonnsgarantiordningen-lonnskravet-ditt.svar.vet-ikke",
              ],
              beskrivendeId: "faktum.arbeidsforhold.dekker-lonnsgarantiordningen-lonnskravet-ditt",
            },
            {
              id: "8037",
              type: "boolean",
              beskrivendeId: "faktum.arbeidsforhold.utbetalt-lonn-etter-konkurs",
              gyldigeValg: [
                "faktum.arbeidsforhold.utbetalt-lonn-etter-konkurs.svar.ja",
                "faktum.arbeidsforhold.utbetalt-lonn-etter-konkurs.svar.nei",
              ],
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
              gyldigeValg: [
                "faktum.arbeidsforhold.midlertidig-arbeidsforhold-med-sluttdato.svar.ja",
                "faktum.arbeidsforhold.midlertidig-arbeidsforhold-med-sluttdato.svar.nei",
                "faktum.arbeidsforhold.midlertidig-arbeidsforhold-med-sluttdato.svar.vet-ikke",
              ],
              beskrivendeId: "faktum.arbeidsforhold.midlertidig-arbeidsforhold-med-sluttdato",
            },
            {
              id: "8043",
              type: "boolean",
              beskrivendeId:
                "faktum.arbeidsforhold.tilbud-om-annen-stilling-eller-annet-sted-i-norge",
              gyldigeValg: [
                "faktum.arbeidsforhold.tilbud-om-annen-stilling-eller-annet-sted-i-norge.svar.ja",
                "faktum.arbeidsforhold.tilbud-om-annen-stilling-eller-annet-sted-i-norge.svar.nei",
              ],
            },
            {
              id: "8044",
              type: "boolean",
              beskrivendeId: "faktum.arbeidsforhold.skift-eller-turnus",
              gyldigeValg: [
                "faktum.arbeidsforhold.skift-eller-turnus.svar.ja",
                "faktum.arbeidsforhold.skift-eller-turnus.svar.nei",
              ],
            },
            {
              id: "8045",
              type: "boolean",
              beskrivendeId: "faktum.arbeidsforhold.rotasjon",
              gyldigeValg: [
                "faktum.arbeidsforhold.rotasjon.svar.ja",
                "faktum.arbeidsforhold.rotasjon.svar.nei",
              ],
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
    },
  ],
};
