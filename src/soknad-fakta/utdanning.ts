import { BlueprintSeksjon } from "./soknad";

export const utdanning: BlueprintSeksjon = {
  id: "utdanning",
  fakta: [
    {
      id: "faktum.tar-du-utdanning",
      type: "boolean",
      answerOptions: [
        { id: "faktum.tar-du-utdanning.svar.ja" },
        { id: "faktum.tar-du-utdanning.svar.nei" },
      ],
      subFakta: [
        {
          id: "faktum.avsluttet-utdanning-siste-6-mnd",
          type: "boolean",
          answerOptions: [
            {
              id: "faktum.avsluttet-utdanning-siste-6-mnd.svar.ja",
              requiredDocuments: [{ id: "dokumentkrav.avsluttet-utdanning-siste-6-mnd.svar.ja" }],
            },
            { id: "faktum.avsluttet-utdanning-siste-6-mnd.svar.nei" },
          ],
          requiredAnswerIds: ["faktum.tar-du-utdanning.svar.nei"],
        },
        {
          id: "faktum.planlegger-utdanning-med-dagpenger",
          type: "boolean",
          answerOptions: [
            { id: "faktum.planlegger-utdanning-med-dagpenger.svar.ja" },
            { id: "faktum.planlegger-utdanning-med-dagpenger.svar.nei" },
          ],
          requiredAnswerIds: ["faktum.tar-du-utdanning.svar.nei"],
        },
      ],
    },
  ],
};
