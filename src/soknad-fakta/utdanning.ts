import { MockDataSeksjon } from "./soknad";

export const utdanning: MockDataSeksjon = {
  id: "utdanning",
  faktum: [
    {
      id: "faktum.utdanning",
      type: "valg",
      answerOptions: [
        { id: "faktum.utdanning.svar.nei" },
        { id: "faktum.utdanning.svar.nei-men-siste-6-mnd" }, //todo: trigge dokumentasjonskrav
        { id: "faktum.utdanning.svar.ja" },
      ],
    },
  ],
};
