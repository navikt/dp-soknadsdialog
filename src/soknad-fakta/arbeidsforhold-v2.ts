import { BlueprintSeksjon } from "./soknad";

export const arbeidsforhold: BlueprintSeksjon = {
  id: "arbeidsforhold",
  faktum: [
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
      faktum: [
        {
          id: "faktum.arbeidsforhold.navn-bedrift",
          type: "tekst",
        },
        {
          id: "faktum.arbeidsforhold.land",
          type: "land",
          answerOptions: [],
          subFaktum: [],
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
          subFaktum: [
            {
              id: "faktum.arbeidsforhold.kjent-antall-timer-jobbet",
              type: "boolean",
              answerOptions: [
                { id: "faktum.arbeidsforhold.kjent-antall-timer-jobbet.svar.ja" },
                { id: "faktum.arbeidsforhold.kjent-antall-timer-jobbet.svar.nei" },
              ],
              subFaktum: [
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
              id: "faktum.arbeidsforhold.varighet",
              type: "periode",
              requiredAnswerIds: [
                "faktum.arbeidsforhold.endret.svar.sagt-opp-av-arbeidsgiver",
                "faktum.arbeidsforhold.endret.svar.arbeidsgiver-konkurs",
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
              subFaktum: [],
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
              id: "faktum.arbeidsforhold.antall-timer-dette-arbeidsforhold",
              type: "double",
              requiredAnswerIds: [
                "faktum.arbeidsforhold.vet-du-antall-timer-foer-mistet-jobb.svar.ja",
                "faktum.arbeidsforhold.vet-du-antall-timer-foer-konkurs.svar.ja",
              ],
            },
            {
              id: "faktum.arbeidsforhold.soke-forskudd-lonnsgarantimidler",
              type: "boolean",
              answerOptions: [
                { id: "faktum.arbeidsforhold.soke-forskudd-lonnsgarantimidler.svar.ja" },
                { id: "faktum.arbeidsforhold.soke-forskudd-lonnsgarantimidler.svar.nei" },
              ],
              subFaktum: [
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
                  subFaktum: [
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
              id: "faktum.arbeidsforhold.tilbud-om-annen-stilling",
              type: "boolean",
              answerOptions: [
                { id: "faktum.arbeidsforhold.tilbud-om-annen-stilling.svar.ja" },
                { id: "faktum.arbeidsforhold.tilbud-om-annen-stilling.svar.nei" },
              ],
              requiredAnswerIds: ["faktum.arbeidsforhold.endret.svar.sagt-opp-av-arbeidsgiver"],
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
              ],
            },
            {
              id: "faktum.arbeidsforhold.rotasjon",
              type: "boolean",
              answerOptions: [
                { id: "faktum.arbeidsforhold.rotasjon.svar.ja" },
                { id: "faktum.arbeidsforhold.rotasjon.svar.nei" },
              ],
              subFaktum: [
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
              ],
            },
          ],
        },
      ],
    },
  ],
};
