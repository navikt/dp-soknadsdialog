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
      subFaktum: [],
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
          id: "faktum.arbeidsforhold.aarsak",
          type: "envalg",
          answerOptions: [
            { id: "faktum.arbeidsforhold.aarsak.svar.ikke-endret" },
            { id: "faktum.arbeidsforhold.aarsak.svar.sagt-opp-av-arbeidsgiver" },
            { id: "faktum.arbeidsforhold.aarsak.svar.kontrakt-utgaatt" },
            { id: "faktum.arbeidsforhold.aarsak.svar.sagt-opp-selv" },
            { id: "faktum.arbeidsforhold.aarsak.svar.redusert-arbeidstid" },
            { id: "faktum.arbeidsforhold.aarsak.svar.arbeidsgiver-konkurs" },
            { id: "faktum.arbeidsforhold.aarsak.svar.avskjediget" },
            { id: "faktum.arbeidsforhold.aarsak.svar.permittert" },
          ],
          subFaktum: [
            {
              id: "faktum.arbeidsforhold.varighet",
              type: "periode",
              requiredAnswerIds: [
                "faktum.arbeidsforhold.aarsak.svar.sagt-opp-av-arbeidsgiver",
                "faktum.arbeidsforhold.aarsak.svar.kontrakt-utgaatt",
                "faktum.arbeidsforhold.aarsak.svar.sagt-opp-selv",
                "faktum.arbeidsforhold.aarsak.svar.redusert-arbeidstid",
                "faktum.arbeidsforhold.aarsak.svar.arbeidsgiver-konkurs",
                "faktum.arbeidsforhold.aarsak.svar.avskjediget",
              ],
            }, // obs, beskrivelse på dette faktumet må passe samtlige arbeidsforhold-årsaker. trenger derfor gode hjelpetekster under svar på arbeidsforhold.aarsak
            {
              id: "faktum.arbeidsforhold-ekstra-opplysninger-laerlig",
              type: "flervalg",
              requiredAnswerIds: [
                "faktum.arbeidsforhold.aarsak.svar.sagt-opp-av-arbeidsgiver",
                "faktum.arbeidsforhold.aarsak.svar.permittert",
                "faktum.arbeidsforhold.aarsak.svar.kontrakt-utgaatt",
                "faktum.arbeidsforhold.aarsak.svar.sagt-opp-selv",
                "faktum.arbeidsforhold.aarsak.svar.redusert-arbeidstid",
                "faktum.arbeidsforhold.aarsak.svar.arbeidsgiver-konkurs",
                "faktum.arbeidsforhold.aarsak.svar.avskjediget",
              ],
              answerOptions: [{ id: "faktum.arbeidsforhold-ekstra-opplysninger.svar.laerling" }],
              subFaktum: [],
            },
            {
              id: "faktum.arbeidsforhold-ekstra-opplysninger-fiskeindustri",
              type: "flervalg",
              requiredAnswerIds: ["faktum.arbeidsforhold.aarsak.svar.permittert"],
              answerOptions: [
                { id: "faktum.arbeidsforhold-ekstra-opplysninger.svar.fiskeindustri" },
              ],
              subFaktum: [],
            },
            {
              id: "faktum.arbeidsforhold-ekstra-opplysninger-flere-arbeidsforhold",
              type: "flervalg",
              requiredAnswerIds: [
                "faktum.arbeidsforhold.aarsak.svar.sagt-opp-av-arbeidsgiver",
                "faktum.arbeidsforhold.aarsak.svar.permittert",
                "faktum.arbeidsforhold.aarsak.svar.kontrakt-utgaatt",
                "faktum.arbeidsforhold.aarsak.svar.sagt-opp-selv",
                "faktum.arbeidsforhold.aarsak.svar.redusert-arbeidstid",
                "faktum.arbeidsforhold.aarsak.svar.arbeidsgiver-konkurs",
                "faktum.arbeidsforhold.aarsak.svar.avskjediget",
              ],
              answerOptions: [
                { id: "faktum.arbeidsforhold-ekstra-opplysninger.svar.flere-arbeidsforhold" },
              ],
              subFaktum: [
                {
                  id: "faktum.arbeidsforhold-arbeidstid-timer-i-uken-alle-forhold",
                  type: "double",
                  requiredAnswerIds: [
                    "faktum.arbeidsforhold-ekstra-opplysninger.svar.flere-arbeidsforhold",
                  ],
                }, // denne perioden trenger et vetikke faktum, som disabler spørsmålet
              ],
            },
            {
              id: "faktum.arbeidsforhold-arbeidstid-timer-i-uken",
              type: "double",
              requiredAnswerIds: [
                "faktum.arbeidsforhold.aarsak.svar.sagt-opp-av-arbeidsgiver",
                "faktum.arbeidsforhold.aarsak.svar.permittert",
                "faktum.arbeidsforhold.aarsak.svar.kontrakt-utgaatt",
                "faktum.arbeidsforhold.aarsak.svar.sagt-opp-selv",
                "faktum.arbeidsforhold.aarsak.svar.redusert-arbeidstid",
                "faktum.arbeidsforhold.aarsak.svar.arbeidsgiver-konkurs",
                "faktum.arbeidsforhold.aarsak.svar.avskjediget",
                "faktum.arbeidsforhold.aarsak.svar.ikke-endret",
              ],
            }, // Denne perioden trenger et vetikke faktum, som disabler spørsmålet ++ situasjonen ikke-endret bør ikke trigge spørsmål om arbeidstid
            {
              id: "faktum.arbeidsforhold.aarsak-til-oppsigelse-fra-arbeidsgiver",
              type: "tekst",
              requiredAnswerIds: ["faktum.arbeidsforhold.aarsak.svar.sagt-opp-av-arbeidsgiver"],
            },
            {
              id: "faktum.arbeidsforhold.aarsak-til-avskjedigelse-fra-arbeidsgiver",
              type: "tekst",
              requiredAnswerIds: ["faktum.arbeidsforhold.aarsak.svar.avskjediget"],
            }, // Duplikat spørsmål som over? Bør det være et generisk spørsmål? Er det to forskjellige fakta/spørsmål? Årsak endring i arbeidsforhold? for navsk?
            {
              id: "faktum.tilbud-annen-stilling-annet-sted-samme-arbeidsgiver",
              type: "boolean",
              requiredAnswerIds: [
                "faktum.arbeidsforhold.aarsak.svar.sagt-opp-av-arbeidsgiver",
                "faktum.arbeidsforhold.aarsak.svar.kontrakt-utgaatt",
              ],
              answerOptions: [
                { id: "faktum.tilbud-annen-stilling-annet-sted-samme-arbeidsgiver.svar.ja" },
                { id: "faktum.tilbud-annen-stilling-annet-sted-samme-arbeidsgiver.svar.nei" },
              ],
              subFaktum: [],
            },
            {
              id: "faktum.tilbud-forsette-samme-arbeidsgiver",
              type: "boolean",
              requiredAnswerIds: ["faktum.arbeidsforhold.aarsak.svar.redusert-arbeidstid"],
              answerOptions: [
                { id: "faktum.tilbud-forsette-samme-arbeidsgiver.svar.ja" },
                { id: "faktum.tilbud-forsette-samme-arbeidsgiver.svar.nei" },
              ],
              subFaktum: [],
            }, // Tenger vi denne? Spørsmål stilt i #dagpenger-soknad kanelen. Nesten identisk spørsmål over
            {
              id: "faktum.arbeids-skift-turnus-rotasjon",
              type: "envalg",
              requiredAnswerIds: [
                "faktum.arbeidsforhold.aarsak.svar.sagt-opp-av-arbeidsgiver",
                "faktum.arbeidsforhold.aarsak.svar.kontrakt-utgaatt",
                "faktum.arbeidsforhold.aarsak.svar.permittert",
                "faktum.arbeidsforhold.aarsak.svar.sagt-opp-selv",
                "faktum.arbeidsforhold.aarsak.svar.redusert-arbeidstid",
              ],
              answerOptions: [
                { id: "faktum.arbeids-skift-turnus-rotasjon.svar.nei" },
                { id: "faktum.arbeids-skift-turnus-rotasjon.svar.ja-skift-turnus" },
                {
                  id: "faktum.arbeids-skift-turnus-rotasjon.svar.ja-rotasjon",
                },
              ],
              subFaktum: [
                {
                  id: "faktum.arbeidsforhold-rotasjon-antall-arbeidsdager",
                  type: "int",
                  requiredAnswerIds: ["faktum.arbeids-skift-turnus-rotasjon.svar.ja-rotasjon"],
                },
                {
                  id: "faktum.arbeidsforhold-rotasjon-antall-fridager",
                  type: "int",
                  requiredAnswerIds: ["faktum.arbeids-skift-turnus-rotasjon.svar.ja-rotasjon"],
                },
              ],
            },
            {
              id: "faktum.midlertidig-arbeidsforhold-med-sluttdato",
              type: "envalg",
              requiredAnswerIds: [
                "faktum.arbeidsforhold.aarsak.svar.permittert",
                "faktum.arbeidsforhold.aarsak.svar.arbeidsgiver-konkurs",
              ],
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
                  requiredAnswerIds: ["faktum.midlertidig-arbeidsforhold-med-sluttdato.svar.ja"],
                },
              ],
            },
            {
              id: "faktum.arbeidsforhold-permitteringsperiode",
              type: "periode",
              requiredAnswerIds: ["faktum.arbeidsforhold.aarsak.svar.permittert"],
            },
            {
              id: "faktum.arbeidsforhold-permitteringgrad",
              type: "int",
              requiredAnswerIds: ["faktum.arbeidsforhold.aarsak.svar.permittert"],
            },
            {
              id: "faktum.arbeidsforhold-lonnsplinkt-arbeidsgiver",
              type: "periode",
              requiredAnswerIds: ["faktum.arbeidsforhold.aarsak.svar.permittert"],
            }, // Denne perioden trenger et vetikke faktum, som disabler spørsmålet
            {
              id: "faktum.aarsak-til-sagt-opp-selv",
              type: "tekst",
              requiredAnswerIds: ["faktum.arbeidsforhold.aarsak.svar.sagt-opp-selv"],
            },
            {
              id: "faktum.arbeidsforhold-arbeidsgiver-konkurs-navn-bostyrer",
              type: "tekst",
              requiredAnswerIds: ["faktum.arbeidsforhold.aarsak.svar.arbeidsgiver-konkurs"],
            },
            {
              id: "faktum.arbeidsforhold-dagpenger-og-forskudd-lonnsgarantimidler",
              type: "envalg",
              requiredAnswerIds: ["faktum.arbeidsforhold.aarsak.svar.arbeidsgiver-konkurs"],
              answerOptions: [
                {
                  id: "faktum.arbeidsforhold-dagpenger-og-forskudd-lonnsgarantimidler.svar.ja-begge",
                },
                {
                  id: "faktum.arbeidsforhold-dagpenger-og-forskudd-lonnsgarantimidler.svar.nei-kun-dagpenger",
                },
                {
                  id: "faktum.arbeidsforhold-dagpenger-og-forskudd-lonnsgarantimidler.svar.nei-kun-forskudd-lonnsgarantimidler",
                },
              ],
              subFaktum: [
                {
                  id: "faktum.arbeidsforhold-godta-nav-trekk-direkte-lonnsgaranti",
                  type: "boolean",
                  requiredAnswerIds: [
                    "faktum.arbeidsforhold-dagpenger-og-forskudd-lonnsgarantimidler.svar.ja-begge",
                    "faktum.arbeidsforhold-dagpenger-og-forskudd-lonnsgarantimidler.svar.nei-kun-forskudd-lonnsgarantimidler",
                  ],
                  answerOptions: [
                    {
                      id: "faktum.arbeidsforhold-godta-nav-trekk-direkte-lonnsgaranti.svar.ja",
                    },
                    {
                      id: "faktum.arbeidsforhold-godta-nav-trekk-direkte-lonnsgaranti.svar.nei",
                    },
                  ],
                },
                {
                  id: "faktum.arbeidsforhold-sok-lonnsgarantimidler",
                  type: "envalg",
                  requiredAnswerIds: [
                    "faktum.arbeidsforhold-dagpenger-og-forskudd-lonnsgarantimidler.svar.ja-begge",
                    "faktum.arbeidsforhold-dagpenger-og-forskudd-lonnsgarantimidler.svar.nei-kun-forskudd-lonnsgarantimidler",
                  ],
                  answerOptions: [
                    {
                      id: "faktum.arbeidsforhold-sok-lonnsgarantimidler.svar.ja-allerede-sendt",
                    },
                    {
                      id: "faktum.arbeidsforhold-sok-lonnsgarantimidler.svar.ja-skal-sende",
                    },
                    {
                      id: "faktum.arbeidsforhold-sok-lonnsgarantimidler.svar.nei",
                    },
                  ],
                  subFaktum: [
                    {
                      id: "faktum.arbeidsforhold-lonnsgaranti-dekker-krav",
                      type: "envalg",
                      requiredAnswerIds: [
                        "faktum.arbeidsforhold-sok-lonnsgarantimidler.svar.ja-allerede-sendt",
                      ],
                      answerOptions: [
                        {
                          id: "faktum.arbeidsforhold-lonnsgaranti-dekker-krav.svar.nei",
                        },
                        {
                          id: "faktum.arbeidsforhold-lonnsgaranti-dekker-krav.svar.ja",
                        },
                        {
                          id: "faktum.arbeidsforhold-lonnsgaranti-dekker-krav.svar.vet-ikke",
                        },
                      ],
                      subFaktum: [],
                    },
                  ],
                },
                {
                  id: "faktum.arbeidsforhold-godta-trekk-direkte-konkursbo",
                  type: "boolean",
                  requiredAnswerIds: [
                    "faktum.arbeidsforhold-dagpenger-og-forskudd-lonnsgarantimidler.svar.ja-begge",
                    "faktum.arbeidsforhold-dagpenger-og-forskudd-lonnsgarantimidler.svar.nei-kun-dagpenger",
                  ],
                  answerOptions: [
                    {
                      id: "faktum.arbeidsforhold-godta-trekk-direkte-konkursbo.svar.ja",
                    },
                    {
                      id: "faktum.arbeidsforhold-godta-trekk-direkte-konkursbo.svar.nei",
                    },
                  ],
                  subFaktum: [],
                },
              ],
            },
            {
              id: "faktum.arbeidsforhold-utbetalt-lonn-etter-konkurs",
              type: "boolean",
              requiredAnswerIds: ["faktum.arbeidsforhold.aarsak.svar.arbeidsgiver-konkurs"],
              answerOptions: [
                {
                  id: "faktum.arbeidsforhold-utbetalt-lonn-etter-konkurs.svar.ja",
                },
                {
                  id: "faktum.arbeidsforhold-utbetalt-lonn-etter-konkurs.svar.nei",
                },
              ],
              subFaktum: [
                {
                  id: "faktum.arbeidsforhold-konkurs-siste-dag-lonn",
                  type: "localdate",
                  requiredAnswerIds: ["faktum.arbeidsforhold-utbetalt-lonn-etter-konkurs.svar.ja"],
                },
              ],
            },
            {
              id: "faktum.arbeidsforhold-tillegsinformasjon",
              type: "tekst",
              requiredAnswerIds: ["faktum.arbeidsforhold.aarsak.svar.ikke-endret"],
            },
          ],
        },
      ],
    },
  ],
};
