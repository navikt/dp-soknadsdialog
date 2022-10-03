import { IQuizSeksjon } from "../../types/quiz.types";

export const seksjonGjenopptak: IQuizSeksjon = {
  fakta: [
    {
      id: "10001",
      svar: "faktum.mottatt-dagpenger-siste-12-mnd.svar.nei",
      type: "envalg",
      readOnly: false,
      gyldigeValg: [
        "faktum.mottatt-dagpenger-siste-12-mnd.svar.ja",
        "faktum.mottatt-dagpenger-siste-12-mnd.svar.nei",
        "faktum.mottatt-dagpenger-siste-12-mnd.svar.vet-ikke",
      ],
      beskrivendeId: "faktum.mottatt-dagpenger-siste-12-mnd",
      sannsynliggjøresAv: [],
      roller: [],
    },
  ],
  beskrivendeId: "gjenopptak",
  ferdig: true,
};
