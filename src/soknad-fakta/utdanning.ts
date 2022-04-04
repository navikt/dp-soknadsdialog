import { BlueprintDataSeksjon } from "./soknad";

export const utdanning: BlueprintDataSeksjon = {
  id: "utdanning",
  faktum: [
    {
      id: "faktum.utdanning",
      type: "envalg",
      answerOptions: [
        { id: "faktum.utdanning.svar.nei" },
        { id: "faktum.utdanning.svar.nei-men-siste-6-mnd" }, //todo: trigge dokumentasjonskrav
        { id: "faktum.utdanning.svar.nei-men-planlagt-start" },
        { id: "faktum.utdanning.svar.ja" },
      ],
    },
  ],
};
