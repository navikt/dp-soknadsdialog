import { BlueprintSeksjon } from "./soknad";

export const arbeidsforhold: BlueprintSeksjon = {
  id: "arbeidsforhold",
  fakta: [
    {
      id: "faktum.dagpenger-soknadsdato",
      type: "localdate",
    },
    {
      id: "faktum.type-arbeidstid",
      type: "envalg",
      answerOptions: [
        { id: "faktum.type-arbeidstid.svar.fast" },
        { id: "faktum.type-arbeidstid.svar.varierende" },
        { id: "faktum.type-arbeidstid.svar.kombinasjon" },
        { id: "faktum.type-arbeidstid.svar.ingen-passer" },
      ],
    },
    {
      id: "faktum.arbeidsforhold",
      type: "generator",
      fakta: [
        {
          id: "faktum.arbeidsforhold.navn-bedrift",
          type: "tekst",
        },
        {
          id: "faktum.arbeidsforhold.land",
          type: "land",
          answerOptions: [],
        },
        {
          id: "faktum.arbeidsforhold.endret",
          type: "envalg",
          answerOptions: [
            { id: "faktum.arbeidsforhold.endret.svar.ikke-endret" },
            { id: "faktum.arbeidsforhold.endret.svar.avskjediget" },
            { id: "faktum.arbeidsforhold.endret.svar.sagt-opp-av-arbeidsgiver" },
            { id: "faktum.arbeidsforhold.endret.svar.arbeidsgiver-konkurs" },
            { id: "faktum.arbeidsforhold.endret.svar.kontrakt-utgaatt" },
            { id: "faktum.arbeidsforhold.endret.svar.sagt-opp-selv" },
            { id: "faktum.arbeidsforhold.endret.svar.redusert-arbeidstid" },
            { id: "faktum.arbeidsforhold.endret.svar.permittert" },
          ],
          subFakta: [
            {
              id: "faktum.arbeidsforhold.kjent-antall-timer-jobbet",
              type: "boolean",
              answerOptions: [
                { id: "faktum.arbeidsforhold.kjent-antall-timer-jobbet.svar.ja" },
                { id: "faktum.arbeidsforhold.kjent-antall-timer-jobbet.svar.nei" },
              ],
              subFakta: [
                {
                  id: "faktum.arbeidsforhold.antall-timer-jobbet",
                  type: "double",
                  requiredAnswerIds: ["faktum.arbeidsforhold.kjent-antall-timer-jobbet.svar.ja"],
                },
              ],
              requiredAnswerIds: ["faktum.arbeidsforhold.endret.svar.ikke-endret"],
            },
            {
              id: "faktum.arbeidsforhold.tilleggsopplysninger",
              type: "tekst",
              requiredAnswerIds: ["faktum.arbeidsforhold.endret.svar.ikke-endret"],
            },
            {
              id: "faktum.arbeidsforhold.startdato-arbeidsforhold",
              type: "localdate",
              requiredAnswerIds: ["faktum.arbeidsforhold.endret.svar.redusert-arbeidstid"],
            },
            {
              id: "faktum.arbeidsforhold.arbeidstid-redusert-fra-dato",
              type: "localdate",
              requiredAnswerIds: ["faktum.arbeidsforhold.endret.svar.redusert-arbeidstid"],
            },
            {
              id: "faktum.arbeidsforhold.midlertidig-med-kontraktfestet-sluttdato",
              type: "envalg",
              answerOptions: [
                { id: "faktum.arbeidsforhold.midlertidig-med-kontraktfestet-sluttdato.svar.ja" },
                { id: "faktum.arbeidsforhold.midlertidig-med-kontraktfestet-sluttdato.svar.nei" },
                {
                  id: "faktum.arbeidsforhold.midlertidig-med-kontraktfestet-sluttdato.svar.vet-ikke",
                },
              ],
              subFakta: [
                {
                  id: "faktum.arbeidsforhold.kontraktfestet-sluttdato",
                  type: "localdate",
                  requiredAnswerIds: [
                    "faktum.arbeidsforhold.midlertidig-med-kontraktfestet-sluttdato.svar.ja",
                  ],
                },
              ],
              requiredAnswerIds: ["faktum.arbeidsforhold.endret.svar.permittert"],
            },
            {
              id: "faktum.arbeidsforhold.midlertidig-arbeidsforhold-oppstartsdato",
              type: "localdate",
              requiredAnswerIds: ["faktum.arbeidsforhold.endret.svar.permittert"],
            },
            {
              id: "faktum.arbeidsforhold.permittertert-fra-fiskeri-naering",
              type: "boolean",
              answerOptions: [
                { id: "faktum.arbeidsforhold.permittertert-fra-fiskeri-naering.svar.ja" },
                { id: "faktum.arbeidsforhold.permittertert-fra-fiskeri-naering.svar.nei" },
              ],
              requiredAnswerIds: ["faktum.arbeidsforhold.endret.svar.permittert"],
            },

            {
              id: "faktum.arbeidsforhold.varighet",
              type: "periode",
              requiredAnswerIds: [
                "faktum.arbeidsforhold.endret.svar.sagt-opp-av-arbeidsgiver",
                "faktum.arbeidsforhold.endret.svar.arbeidsgiver-konkurs",
                "faktum.arbeidsforhold.endret.svar.kontrakt-utgaatt",
                "faktum.arbeidsforhold.endret.svar.sagt-opp-selv",
              ],
            },
            {
              id: "faktum.arbeidsforhold.vet-du-antall-timer-foer-mistet-jobb",
              type: "boolean",
              answerOptions: [
                {
                  id: "faktum.arbeidsforhold.vet-du-antall-timer-foer-mistet-jobb.svar.ja",
                },
                {
                  id: "faktum.arbeidsforhold.vet-du-antall-timer-foer-mistet-jobb.svar.nei",
                },
              ],
              subFakta: [],
              requiredAnswerIds: [
                "faktum.arbeidsforhold.endret.svar.sagt-opp-av-arbeidsgiver",
                "faktum.arbeidsforhold.endret.svar.avskjediget",
              ],
            },
            {
              id: "faktum.arbeidsforhold.vet-du-antall-timer-foer-konkurs",
              type: "boolean",
              answerOptions: [
                {
                  id: "faktum.arbeidsforhold.vet-du-antall-timer-foer-konkurs.svar.ja",
                },
                {
                  id: "faktum.arbeidsforhold.vet-du-antall-timer-foer-konkurs.svar.nei",
                },
              ],
              requiredAnswerIds: ["faktum.arbeidsforhold.endret.svar.arbeidsgiver-konkurs"],
            },
            {
              id: "faktum.arbeidsforhold.vet-du-antall-timer-foer-kontrakt-utgikk",
              type: "boolean",
              answerOptions: [
                {
                  id: "faktum.arbeidsforhold.vet-du-antall-timer-foer-kontrakt-utgikk.svar.ja",
                },
                {
                  id: "faktum.arbeidsforhold.vet-du-antall-timer-foer-kontrakt-utgikk.svar.nei",
                },
              ],
              requiredAnswerIds: ["faktum.arbeidsforhold.endret.svar.kontrakt-utgaatt"],
            },
            {
              id: "faktum.arbeidsforhold.vet-du-antall-timer-foer-du-sa-opp",
              type: "boolean",
              answerOptions: [
                {
                  id: "faktum.arbeidsforhold.vet-du-antall-timer-foer-du-sa-opp.svar.ja",
                },
                {
                  id: "faktum.arbeidsforhold.vet-du-antall-timer-foer-du-sa-opp.svar.nei",
                },
              ],
              requiredAnswerIds: ["faktum.arbeidsforhold.endret.svar.sagt-opp-selv"],
            },
            {
              id: "faktum.arbeidsforhold.vet-du-antall-timer-foer-redusert-arbeidstid",
              type: "boolean",
              answerOptions: [
                {
                  id: "faktum.arbeidsforhold.vet-du-antall-timer-foer-redusert-arbeidstid.svar.ja",
                },
                {
                  id: "faktum.arbeidsforhold.vet-du-antall-timer-foer-redusert-arbeidstid.svar.nei",
                },
              ],
              requiredAnswerIds: ["faktum.arbeidsforhold.endret.svar.redusert-arbeidstid"],
            },
            {
              id: "faktum.arbeidsforhold.vet-du-antall-timer-foer-permittert",
              type: "boolean",
              answerOptions: [
                {
                  id: "faktum.arbeidsforhold.vet-du-antall-timer-foer-permittert.svar.ja",
                },
                {
                  id: "faktum.arbeidsforhold.vet-du-antall-timer-foer-permittert.svar.nei",
                },
              ],
              requiredAnswerIds: ["faktum.arbeidsforhold.endret.svar.permittert"],
            },
            {
              id: "faktum.arbeidsforhold.antall-timer-dette-arbeidsforhold",
              type: "double",
              requiredAnswerIds: [
                "faktum.arbeidsforhold.vet-du-antall-timer-foer-mistet-jobb.svar.ja",
                "faktum.arbeidsforhold.vet-du-antall-timer-foer-konkurs.svar.ja",
                "faktum.arbeidsforhold.vet-du-antall-timer-foer-kontrakt-utgikk.svar.ja",
                "faktum.arbeidsforhold.vet-du-antall-timer-foer-du-sa-opp.svar.ja",
                "faktum.arbeidsforhold.vet-du-antall-timer-foer-redusert-arbeidstid.svar.ja",
                "faktum.arbeidsforhold.vet-du-antall-timer-foer-permittert.svar.ja",
              ],
            },
            {
              id: "faktum.arbeidsforhold.permittert-periode",
              type: "periode",
              requiredAnswerIds: ["faktum.arbeidsforhold.endret.svar.permittert"],
            },
            {
              id: "faktum.arbeidsforhold.permittert-prosent",
              type: "int",
              requiredAnswerIds: ["faktum.arbeidsforhold.endret.svar.permittert"],
            },
            {
              id: "faktum.arbeidsforhold.vet-du-lonnsplikt-periode",
              type: "boolean",
              answerOptions: [
                { id: "faktum.arbeidsforhold.vet-du-lonnsplikt-periode.svar.ja" },
                { id: "faktum.arbeidsforhold.vet-du-lonnsplikt-periode.svar.nei" },
              ],
              subFakta: [
                {
                  id: "faktum.arbeidsforhold.naar-var-lonnsplikt-periode",
                  type: "periode",
                  requiredAnswerIds: ["faktum.arbeidsforhold.vet-du-lonnsplikt-periode.svar.ja"],
                },
              ],
              requiredAnswerIds: ["faktum.arbeidsforhold.endret.svar.permittert"],
            },
            {
              id: "faktum.arbeidsforhold.aarsak-til-du-sa-opp",
              type: "tekst",
              requiredAnswerIds: ["faktum.arbeidsforhold.endret.svar.sagt-opp-selv"],
            },
            {
              id: "faktum.arbeidsforhold.tilbud-om-forlengelse-eller-annen-stilling",
              type: "boolean",
              answerOptions: [
                { id: "faktum.arbeidsforhold.tilbud-om-forlengelse-eller-annen-stilling.svar.ja" },
                { id: "faktum.arbeidsforhold.tilbud-om-forlengelse-eller-annen-stilling.svar.nei" },
              ],
              subFakta: [
                {
                  id: "faktum.arbeidsforhold.svar-paa-forlengelse-eller-annen-stilling",
                  type: "envalg",
                  answerOptions: [
                    {
                      id: "faktum.arbeidsforhold.svar-paa-forlengelse-eller-annen-stilling.svar.ja",
                    },
                    {
                      id: "faktum.arbeidsforhold.svar-paa-forlengelse-eller-annen-stilling.svar.nei",
                    },
                    {
                      id: "faktum.arbeidsforhold.svar-paa-forlengelse-eller-annen-stilling.svar.ikke-svart",
                    },
                  ],
                  subFakta: [
                    {
                      id: "faktum.arbeidsforhold.aarsak-til-ikke-akseptert-tilbud",
                      type: "tekst",
                      requiredAnswerIds: [
                        "faktum.arbeidsforhold.svar-paa-forlengelse-eller-annen-stilling.svar.nei",
                      ],
                    },
                  ],
                  requiredAnswerIds: [
                    "faktum.arbeidsforhold.tilbud-om-forlengelse-eller-annen-stilling.svar.ja",
                  ],
                },
              ],
              requiredAnswerIds: ["faktum.arbeidsforhold.endret.svar.kontrakt-utgaatt"],
            },
            {
              id: "faktum.arbeidsforhold.soke-forskudd-lonnsgarantimidler",
              type: "boolean",
              answerOptions: [
                { id: "faktum.arbeidsforhold.soke-forskudd-lonnsgarantimidler.svar.ja" },
                { id: "faktum.arbeidsforhold.soke-forskudd-lonnsgarantimidler.svar.nei" },
              ],
              subFakta: [
                {
                  id: "faktum.arbeidsforhold.soke-forskudd-lonnsgarantimidler-i-tillegg-til-dagpenger",
                  type: "boolean",
                  answerOptions: [
                    {
                      id: "faktum.arbeidsforhold.soke-forskudd-lonnsgarantimidler-i-tillegg-til-dagpenger.svar.ja",
                    },
                    {
                      id: "faktum.arbeidsforhold.soke-forskudd-lonnsgarantimidler-i-tillegg-til-dagpenger.svar.nei",
                    },
                  ],
                  requiredAnswerIds: [
                    "faktum.arbeidsforhold.soke-forskudd-lonnsgarantimidler.svar.ja",
                  ],
                },
                {
                  id: "faktum.arbeidsforhold.godta-trekk-fra-nav-av-forskudd-fra-lonnsgarantimidler",
                  type: "boolean",
                  answerOptions: [
                    {
                      id: "faktum.arbeidsforhold.godta-trekk-fra-nav-av-forskudd-fra-lonnsgarantimidler.svar.ja",
                    },
                    {
                      id: "faktum.arbeidsforhold.godta-trekk-fra-nav-av-forskudd-fra-lonnsgarantimidler.svar.nei",
                    },
                  ],
                  requiredAnswerIds: [
                    "faktum.arbeidsforhold.soke-forskudd-lonnsgarantimidler.svar.ja",
                  ],
                },
                {
                  id: "faktum.arbeidsforhold.har-sokt-om-lonnsgarantimidler",
                  type: "envalg",
                  answerOptions: [
                    { id: "faktum.arbeidsforhold.har-sokt-om-lonnsgarantimidler.svar.nei" },
                    {
                      id: "faktum.arbeidsforhold.har-sokt-om-lonnsgarantimidler.svar.nei-men-skal",
                    },
                    { id: "faktum.arbeidsforhold.har-sokt-om-lonnsgarantimidler.svar.ja" },
                  ],
                  requiredAnswerIds: [
                    "faktum.arbeidsforhold.soke-forskudd-lonnsgarantimidler.svar.ja",
                  ],
                },
                {
                  id: "faktum.arbeidsforhold.dekker-lonnsgarantiordningen-lonnskravet-ditt",
                  type: "envalg",
                  answerOptions: [
                    {
                      id: "faktum.arbeidsforhold.dekker-lonnsgarantiordningen-lonnskravet-ditt.svar.ja",
                    },
                    {
                      id: "faktum.arbeidsforhold.dekker-lonnsgarantiordningen-lonnskravet-ditt.svar.nei",
                    },
                    {
                      id: "faktum.arbeidsforhold.dekker-lonnsgarantiordningen-lonnskravet-ditt.svar.vet-ikke",
                    },
                  ],
                  requiredAnswerIds: [
                    "faktum.arbeidsforhold.soke-forskudd-lonnsgarantimidler.svar.ja",
                  ],
                },
                {
                  id: "faktum.arbeidsforhold.utbetalt-lonn-etter-konkurs",
                  type: "boolean",
                  answerOptions: [
                    { id: "faktum.arbeidsforhold.utbetalt-lonn-etter-konkurs.svar.ja" },
                    { id: "faktum.arbeidsforhold.utbetalt-lonn-etter-konkurs.svar.nei" },
                  ],
                  subFakta: [
                    {
                      id: "faktum.arbeidsforhold.siste-dag-utbetalt-for-konkurs",
                      type: "localdate",
                      requiredAnswerIds: [
                        "faktum.arbeidsforhold.utbetalt-lonn-etter-konkurs.svar.ja",
                      ],
                    },
                  ],
                  requiredAnswerIds: [
                    "faktum.arbeidsforhold.soke-forskudd-lonnsgarantimidler.svar.ja",
                  ],
                },
              ],
              requiredAnswerIds: ["faktum.arbeidsforhold.endret.svar.arbeidsgiver-konkurs"],
            },
            {
              id: "faktum.arbeidsforhold.hva-er-aarsak-til-avskjediget",
              type: "tekst",
              requiredAnswerIds: ["faktum.arbeidsforhold.endret.svar.avskjediget"],
            },
            {
              id: "faktum.arbeidsforhold.vet-du-aarsak-til-sagt-opp-av-arbeidsgiver",
              type: "tekst",
              requiredAnswerIds: ["faktum.arbeidsforhold.endret.svar.sagt-opp-av-arbeidsgiver"],
            },
            {
              id: "faktum.arbeidsforhold.vet-du-aarsak-til-redusert-arbeidstid",
              type: "tekst",
              requiredAnswerIds: ["faktum.arbeidsforhold.endret.svar.redusert-arbeidstid"],
            },
            {
              id: "faktum.arbeidsforhold.midlertidig-arbeidsforhold-med-sluttdato",
              type: "envalg",
              answerOptions: [
                { id: "faktum.arbeidsforhold.midlertidig-arbeidsforhold-med-sluttdato.svar.ja" },
                { id: "faktum.arbeidsforhold.midlertidig-arbeidsforhold-med-sluttdato.svar.nei" },
                {
                  id: "faktum.arbeidsforhold.midlertidig-arbeidsforhold-med-sluttdato.svar.vet-ikke",
                },
              ],
              requiredAnswerIds: ["faktum.arbeidsforhold.endret.svar.arbeidsgiver-konkurs"],
            },
            {
              id: "faktum.arbeidsforhold.tilbud-om-annen-stilling-eller-annet-sted-i-norge",
              type: "boolean",
              answerOptions: [
                {
                  id: "faktum.arbeidsforhold.tilbud-om-annen-stilling-eller-annet-sted-i-norge.svar.ja",
                },
                {
                  id: "faktum.arbeidsforhold.tilbud-om-annen-stilling-eller-annet-sted-i-norge.svar.nei",
                },
              ],
              requiredAnswerIds: [
                "faktum.arbeidsforhold.endret.svar.sagt-opp-av-arbeidsgiver",
                "faktum.arbeidsforhold.endret.svar.redusert-arbeidstid",
              ],
            },
            {
              id: "faktum.arbeidsforhold.skift-eller-turnus",
              type: "boolean",
              answerOptions: [
                { id: "faktum.arbeidsforhold.skift-eller-turnus.svar.ja" },
                { id: "faktum.arbeidsforhold.skift-eller-turnus.svar.nei" },
              ],
              requiredAnswerIds: [
                "faktum.arbeidsforhold.endret.svar.sagt-opp-av-arbeidsgiver",
                "faktum.arbeidsforhold.endret.svar.arbeidsgiver-konkurs",
                "faktum.arbeidsforhold.endret.svar.kontrakt-utgaatt",
                "faktum.arbeidsforhold.endret.svar.sagt-opp-selv",
                "faktum.arbeidsforhold.endret.svar.redusert-arbeidstid",
                "faktum.arbeidsforhold.endret.svar.permittert",
              ],
            },
            {
              id: "faktum.arbeidsforhold.rotasjon",
              type: "boolean",
              answerOptions: [
                { id: "faktum.arbeidsforhold.rotasjon.svar.ja" },
                { id: "faktum.arbeidsforhold.rotasjon.svar.nei" },
              ],
              subFakta: [
                {
                  id: "faktum.arbeidsforhold.arbeidsdager-siste-rotasjon",
                  type: "int",
                  requiredAnswerIds: ["faktum.arbeidsforhold.rotasjon.svar.ja"],
                },
                {
                  id: "faktum.arbeidsforhold.fridager-siste-rotasjon",
                  type: "int",
                  requiredAnswerIds: ["faktum.arbeidsforhold.rotasjon.svar.ja"],
                },
              ],
              requiredAnswerIds: [
                "faktum.arbeidsforhold.endret.svar.sagt-opp-av-arbeidsgiver",
                "faktum.arbeidsforhold.endret.svar.arbeidsgiver-konkurs",
                "faktum.arbeidsforhold.endret.svar.kontrakt-utgaatt",
                "faktum.arbeidsforhold.endret.svar.sagt-opp-selv",
                "faktum.arbeidsforhold.endret.svar.redusert-arbeidstid",
                "faktum.arbeidsforhold.endret.svar.permittert",
              ],
            },
          ],
        },
      ],
    },
  ],
};
