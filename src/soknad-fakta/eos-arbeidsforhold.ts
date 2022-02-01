import { MockDataSeksjon } from "./soknad";
// kan denne egentlig bakes inn i arbeidsforhold?
export const eosArbeidsforhold: MockDataSeksjon = {
  id: "eos-arbeidsforhold",
  faktum: [
    {
      id: "faktum.eos-arbeid-siste-36-mnd",
      seksjonId: "eos-arbeidsforhold",
      type: "boolean",
      answerOptions: [
        { id: "faktum.eos-arbeid-siste-36-mnd.svar.ja" },
        { id: "faktum.eos-arbeid-siste-36-mnd.svar.nei" },
      ],
      subFaktum: [
        {
          id: "faktum.eos-arbeidsforhold",
          type: "generator",
          faktum: [],
          requiredAnswerIds: ["faktum.eos-arbeid-siste-36-mnd.svar.ja"],
        },
      ],
    },
  ],
};
