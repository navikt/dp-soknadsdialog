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
              id: "6001",
              beskrivendeId: "faktum.bostedland",
              type: "land",
              grupper: [
                {
                  gruppeId: "faktum.bostedland.gruppe.eos",
                  land: [
                    "BEL",
                    "BGR",
                    "DNK",
                    "EST",
                    "FIN",
                    "FRA",
                    "GRC",
                    "IRL",
                    "ISL",
                    "ITA",
                    "HRV",
                    "CYP",
                    "LVA",
                    "LIE",
                    "LTU",
                    "LUX",
                    "MLT",
                    "NLD",
                    "POL",
                    "PRT",
                    "ROU",
                    "SVK",
                    "SVN",
                    "ESP",
                    "CHE",
                    "SWE",
                    "CZE",
                    "DEU",
                    "HUN",
                    "AUT",
                  ],
                },
                {
                  gruppeId: "faktum.bostedland.gruppe.norge-jan-mayen",
                  land: ["NOR", "SJM"],
                },
              ],
              gyldigeLand: [
                "BEL",
                "BGR",
                "DNK",
                "EST",
                "FIN",
                "FRA",
                "GRC",
                "IRL",
                "ISL",
                "ITA",
                "HRV",
                "CYP",
                "LVA",
                "LIE",
                "LTU",
                "LUX",
                "MLT",
                "NLD",
                "NOR",
                "POL",
                "PRT",
                "ROU",
                "SVK",
                "SVN",
                "ESP",
                "CHE",
                "SWE",
                "CZE",
                "DEU",
                "HUN",
                "AUT",
                "SJM",
              ],
              svar: "NOR",
            },
            {
              id: "1006",
              type: "boolean",
              gyldigeValg: [],
              beskrivendeId: "faktum.forsoerger-du-barnet",
            },
            {
              id: "1007",
              type: "boolean",
              gyldigeValg: [],
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
