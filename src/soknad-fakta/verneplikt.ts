import { MockDataSeksjon } from "./soknad";

export const verneplikt: MockDataSeksjon = {
  id: "verneplikt",
  faktum: [
    {
      id: "faktum.avtjent-militaer-sivilforsvar-tjeneste-siste-12-mnd",
      type: "boolean",
      answerOptions: [
        { id: "faktum.avtjent-militaer-sivilforsvar-tjeneste-siste-12-mnd.svar.ja" }, //todo: trigge dokumentKrav tjenestebevis
        { id: "faktum.avtjent-militaer-sivilforsvar-tjeneste-siste-12-mnd.svar.nei" },
      ],
    },
  ],
};
