import { MockDataSeksjon } from "./soknad";

export const andreYtelser: MockDataSeksjon = {
  id: "andre-ytelser",
  faktum: [
    {
      id: "faktum.andre-ytelser", //todo: de fleste svarene her skal trigge dokumentkrav
      type: "flervalg",
      answerOptions: [
        { id: "faktum.andre-ytelser.svar.pensjon-offentlig-tjenestepensjon" },
        { id: "faktum.andre-ytelser.svar.arbeidsloshet-garantikassen-for-fiskere" },
        { id: "faktum.andre-ytelser.svar.garantilott-garantikassen-for-fiskere" },
        { id: "faktum.andre-ytelser.svar.etterlonn-arbeidsgiver" },
        { id: "faktum.andre-ytelser.svar.vartpenger" },
        { id: "faktum.andre-ytelser.svar.dagpenger-annet-eos-land" },
        { id: "faktum.andre-ytelser.svar.annen-ytelse" },
        { id: "faktum.andre-ytelser.svar.nei" },
      ],
      subFaktum: [
        {
          id: "faktum.tjenestepensjon-hvem-utbetaler-hvilken-periode", //todo: dette bør egentlig være 2 faktum for å kunne automatisere, navn på utbetaler og periode utbetalingen skjer
          type: "tekst",
          requiredAnswerIds: ["faktum.andre-ytelser.svar.pensjon-offentlig-tjenestepensjon"],
        },
        {
          id: "faktum.arbeidsloshet-garantikassen-for-fiskere-periode", //todo: dette bør egentlig være periodefaktum for periode utbetalingen skjer
          type: "tekst",
          requiredAnswerIds: ["faktum.andre-ytelser.svar.arbeidsloshet-garantikassen-for-fiskere"],
        },
        {
          id: "faktum.garantilott-garantikassen-for-fiskere-periode", //todo: dette bør egentlig være periodefaktum for periode utbetalingen skjer
          type: "tekst",
          requiredAnswerIds: ["faktum.andre-ytelser.svar.garantilott-garantikassen-for-fiskere"],
        },
        {
          id: "faktum.etterlonn-hvem-utbetaler-hvilken-periode", //todo: dette bør egentlig være 2 faktum for å kunne automatisere, navn på utbetaler og periode utbetalingen skjer
          type: "tekst", //todo: kunne dette kanskje vært en dropdown på arbeidsforhold som er lagt inn tidligere i søknaden?
          requiredAnswerIds: ["faktum.andre-ytelser.svar.etterlonn-arbeidsgiver"],
        },
        {
          id: "faktum.vartpenger-hvem-utbetaler-hvilken-periode", //todo: dette bør egentlig være 2 faktum for å kunne automatisere, navn på utbetaler og periode utbetalingen skjer
          type: "tekst",
          requiredAnswerIds: ["faktum.andre-ytelser.svar.vartpenger"],
        },
        {
          id: "faktum.dagpenger-annet-eos-land",
          type: "dropdown",
          answerOptions: [], //todo: insert alle verdens land
          requiredAnswerIds: ["faktum.andre-ytelser.svar.dagpenger-annet-eos-land"],
        },
        {
          id: "faktum.annen-ytelse-hvilken",
          type: "tekst",
          requiredAnswerIds: ["faktum.andre-ytelser.svar.annen-ytelse"],
        },
        {
          id: "faktum.annen-ytelse-hvem-utebetaler-hvilken-periode", //todo: dette bør egentlig være 2 faktum for å kunne automatisere, navn på utbetaler og periode utbetalingen skjer
          type: "tekst",
          requiredAnswerIds: ["faktum.andre-ytelser.svar.annen-ytelse"],
        },
      ],
    },
    {
      id: "faktum.utbetaling-okonomisk-gode-tidligere-arbeidsgiver",
      type: "boolean",
      answerOptions: [
        {
          id: "faktum.utbetaling-okonomisk-gode-tidligere-arbeidsgiver.svar.nei",
        },
        { id: "faktum.utbetaling-okonomisk-gode-tidligere-arbeidsgiver.svar.ja" },
      ],
      subFaktum: [
        {
          id: "faktum.okonomisk-gode-tidligere-arbeidsgiver-hva-omfatter-avtalen",
          type: "tekst",
          requiredAnswerIds: ["faktum.utbetaling-okonomisk-gode-tidligere-arbeidsgiver.svar.ja"],
        },
      ],
    },
  ],
};
