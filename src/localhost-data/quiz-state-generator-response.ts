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
            },
            {
              id: "1006",
              type: "boolean",
              beskrivendeId: "faktum.forsoerger-du-barnet",
            },
            {
              id: "1007",
              type: "boolean",
              beskrivendeId: "faktum.barn-aarsinntekt-over-1g",
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
