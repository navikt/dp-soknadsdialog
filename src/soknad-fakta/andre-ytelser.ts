import { BlueprintDataSeksjon } from "./soknad";

export const andreYtelser: BlueprintDataSeksjon = {
  id: "andre-ytelser",
  faktum: [
    {
      id: "faktum.andre-ytelser-mottatt-eller-sokt",
      type: "boolean",
      answerOptions: [
        { id: "faktum.andre-ytelser-mottatt-eller-sokt.svar.ja" },
        { id: "faktum.andre-ytelser-mottatt-eller-sokt.svar.nei" },
      ],
      subFaktum: [
        {
          id: "faktum.hvilke-andre-ytelser",
          type: "flervalg",
          answerOptions: [
            { id: "faktum.hvilke-andre-ytelser.svar.pensjon-offentlig-tjenestepensjon" },
            { id: "faktum.hvilke-andre-ytelser.svar.arbeidsloshet-garantikassen-for-fiskere" },
            { id: "faktum.hvilke-andre-ytelser.svar.garantilott-garantikassen-for-fiskere" },
            { id: "faktum.hvilke-andre-ytelser.svar.etterlonn-arbeidsgiver" },
            { id: "faktum.hvilke-andre-ytelser.svar.dagpenger-annet-eos-land" },
            { id: "faktum.hvilke-andre-ytelser.svar.annen-ytelse" },
          ],
          subFaktum: [
            {
              id: "faktum.tjenestepensjon-hvem-utbetaler",
              type: "tekst",
              requiredAnswerIds: [
                "faktum.hvilke-andre-ytelser.svar.pensjon-offentlig-tjenestepensjon",
              ],
            },
            {
              id: "faktum.tjenestepensjon-hvilken-periode",
              type: "periode",
              requiredAnswerIds: [
                "faktum.hvilke-andre-ytelser.svar.pensjon-offentlig-tjenestepensjon",
              ],
            },
            {
              id: "faktum.etterlonn-arbeidsgiver-hvem-utbetaler",
              type: "tekst",
              requiredAnswerIds: ["faktum.hvilke-andre-ytelser.svar.etterlonn-arbeidsgiver"],
            },
            {
              id: "faktum.etterlonn-arbeidsgiver-hvilken-periode",
              type: "periode",
              requiredAnswerIds: ["faktum.hvilke-andre-ytelser.svar.etterlonn-arbeidsgiver"],
            },
            {
              id: "faktum.dagpenger-hvilket-eos-land-utbetaler",
              type: "land",
              answerOptions: [], //todo: insert alle verdens land
              requiredAnswerIds: ["faktum.hvilke-andre-ytelser.svar.dagpenger-annet-eos-land"],
            },
            {
              id: "faktum.dagpenger-eos-land-hvilken-periode",
              type: "periode",
              requiredAnswerIds: ["faktum.hvilke-andre-ytelser.svar.dagpenger-annet-eos-land"],
            },
            {
              id: "faktum.hvilken-annen-ytelse",
              type: "tekst",
              requiredAnswerIds: ["faktum.hvilke-andre-ytelser.svar.annen-ytelse"],
            },
            {
              id: "faktum.annen-ytelse-hvem-utebetaler",
              type: "tekst",
              requiredAnswerIds: ["faktum.hvilke-andre-ytelser.svar.annen-ytelse"],
            },
            {
              id: "faktum.annen-ytelse-hvilken-periode",
              type: "periode",
              requiredAnswerIds: ["faktum.hvilke-andre-ytelser.svar.annen-ytelse"],
            },
          ],
          requiredAnswerIds: ["faktum.andre-ytelser-mottatt-eller-sokt.svar.ja"],
        },
      ],
    },
    {
      id: "faktum.utbetaling-eller-okonomisk-gode-tidligere-arbeidsgiver",
      type: "boolean",
      answerOptions: [
        {
          id: "faktum.utbetaling-eller-okonomisk-gode-tidligere-arbeidsgiver.svar.nei",
        },
        { id: "faktum.utbetaling-eller-okonomisk-gode-tidligere-arbeidsgiver.svar.ja" },
      ],
      subFaktum: [
        {
          id: "faktum.okonomisk-gode-tidligere-arbeidsgiver-hva-omfatter-avtalen",
          type: "tekst",
          requiredAnswerIds: [
            "faktum.utbetaling-eller-okonomisk-gode-tidligere-arbeidsgiver.svar.ja",
          ],
        },
      ],
    },
  ],
};
