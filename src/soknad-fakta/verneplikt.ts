import { MockDataSeksjon } from "./soknad";

export const verneplikt: MockDataSeksjon = {
  id: "verneplikt",
  faktum: [
    {
      id: "faktum.avtjent-militaer-sivilforsvar-tjeneste-siste-12-mnd",
      type: "boolean",
      answerOptions: [
        { id: "faktum.avtjent-militaer-sivilforsvar-tjeneste-siste-12-mnd.svar.ja" },
        { id: "faktum.avtjent-militaer-sivilforsvar-tjeneste-siste-12-mnd.svar.nei" },
      ],
    },
  ],
};
