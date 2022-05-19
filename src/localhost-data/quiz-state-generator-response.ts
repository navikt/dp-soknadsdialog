import { QuizSeksjon } from "../types/quiz.types";

export interface QuizState {
  ferdig: boolean;
  seksjoner: QuizSeksjon[];
}

export const quizStateGeneratorResponse: QuizState = {
  ferdig: false,
  seksjoner: [
    {
      fakta: [
        {
          id: "1001",
          svar: [],
          type: "generator",
          templates: [
            {
              id: "1002",
              type: "tekst",
              beskrivendeId: "faktum.barn-fornavn-mellomnavn",
            },
            {
              id: "1003",
              type: "tekst",
              beskrivendeId: "faktum.barn-etternavn",
            },
            {
              id: "1004",
              type: "localdate",
              beskrivendeId: "faktum.barn-foedselsdato",
            },
            {
              id: "1005",
              type: "land",
              beskrivendeId: "faktum.barn-bostedsland",
              gyldigeValg: [
                "faktum.barn-bostedsland.svar.utenfor-eos",
                "faktum.barn-bostedsland.svar.eos",
                "faktum.barn-bostedsland.svar.norge-jan-mayen",
              ],
            },
            {
              id: "1006",
              type: "boolean",
              beskrivendeId: "faktum.forsoerger-du-barnet",
              gyldigeValg: [
                "faktum.forsoerger-du-barnet.svar.ja",
                "faktum.forsoerger-du-barnet.svar.nei",
              ],
            },
            {
              id: "1007",
              type: "boolean",
              beskrivendeId: "faktum.barn-aarsinntekt-over-1g",
              gyldigeValg: [
                "faktum.barn-aarsinntekt-over-1g.svar.ja",
                "faktum.barn-aarsinntekt-over-1g.svar.nei",
              ],
            },
            {
              id: "1008",
              type: "int",
              beskrivendeId: "faktum.barn-inntekt",
            },
          ],
          beskrivendeId: "faktum.barn-liste",
        },
      ],
      beskrivendeId: "barnetillegg",
    },
  ],
};
