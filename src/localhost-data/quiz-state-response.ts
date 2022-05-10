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
          svar: "faktum.andre-ytelser-mottatt-eller-sokt.svar.ja",
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
        },
        {
          id: "3",
          beskrivendeId: "faktum.eget-gaardsbruk-arbeidstimer-beregning",
          type: "tekst",
          svar: "Dette har jeg svart",
        },
      ],
    },
  ],
};
