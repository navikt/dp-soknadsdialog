import { QuizSeksjon } from "../types/quiz.types";

export interface QuizState {
  ferdig: boolean;
  seksjoner: QuizSeksjon[];
}

export const quizStateResponse: QuizState = {
  ferdig: false,
  seksjoner: [
    {
      beskrivendeId: "andre-ytelser",
      fakta: [
        {
          id: "1",
          type: "boolean",
          beskrivendeId: "faktum.andre-ytelser-mottatt-eller-sokt",
          gyldigeValg: [
            "faktum.andre-ytelser-mottatt-eller-sokt.svar.ja",
            "faktum.andre-ytelser-mottatt-eller-sokt.svar.nei",
          ],
          svar: true,
        },
        {
          id: "2",
          type: "flervalg",
          beskrivendeId: "faktum.hvilke-andre-ytelser",
          gyldigeValg: [
            "faktum.hvilke-andre-ytelser.svar.pensjon-offentlig-tjenestepensjon",
            "faktum.hvilke-andre-ytelser.svar.arbeidsloshet-garantikassen-for-fiskere",
            "faktum.hvilke-andre-ytelser.svar.garantilott-garantikassen-for-fiskere",
            "faktum.hvilke-andre-ytelser.svar.etterlonn-arbeidsgiver",
            "faktum.hvilke-andre-ytelser.svar.dagpenger-annet-eos-land",
            "faktum.hvilke-andre-ytelser.svar.annen-ytelse",
          ],
          svar: ["faktum.hvilke-andre-ytelser.svar.annen-ytelse"],
        },
        {
          id: "3",
          beskrivendeId: "faktum.eget-gaardsbruk-arbeidstimer-beregning",
          type: "tekst",
          svar: "Dette har jeg svart",
        },
        {
          id: "6",
          type: "localdate",
          beskrivendeId: "dato6",
          svar: "2022-01-14T13:39Z",
        },
        {
          id: "3",
          type: "double",
          beskrivendeId: "desimaltall3",
          svar: 3.0,
        },
      ],
    },
    {
      beskrivendeId: "flere-ytelser",
      fakta: [
        {
          id: "11",
          type: "boolean",
          beskrivendeId: "faktum.andre-ytelser-mottatt-eller-sokt-2",
          gyldigeValg: [
            "faktum.andre-ytelser-mottatt-eller-sokt.svar.ja",
            "faktum.andre-ytelser-mottatt-eller-sokt.svar.nei",
          ],
          svar: true,
        },
        {
          id: "12",
          type: "flervalg",
          beskrivendeId: "faktum.hvilke-andre-ytelser-2",
          gyldigeValg: [
            "faktum.hvilke-andre-ytelser.svar.pensjon-offentlig-tjenestepensjon",
            "faktum.hvilke-andre-ytelser.svar.arbeidsloshet-garantikassen-for-fiskere",
            "faktum.hvilke-andre-ytelser.svar.garantilott-garantikassen-for-fiskere",
            "faktum.hvilke-andre-ytelser.svar.etterlonn-arbeidsgiver",
            "faktum.hvilke-andre-ytelser.svar.dagpenger-annet-eos-land",
            "faktum.hvilke-andre-ytelser.svar.annen-ytelse",
          ],
          svar: ["faktum.hvilke-andre-ytelser.svar.annen-ytelse"],
        },
        {
          id: "13",
          beskrivendeId: "faktum.eget-gaardsbruk-arbeidstimer-beregning-2",
          type: "tekst",
          svar: "Dette har jeg svart",
        },
        {
          id: "16",
          type: "localdate",
          beskrivendeId: "dato6-2",
          svar: "2022-01-14T13:39Z",
        },
        {
          id: "13",
          type: "double",
          beskrivendeId: "desimaltall3-2",
          svar: 3.0,
        },
      ],
    },
  ],
};
