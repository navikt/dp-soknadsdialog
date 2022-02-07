import { MockDataSeksjon } from "./soknad";
// kan denne egentlig bakes inn i arbeidsforhold?
export const eosArbeidsforhold: MockDataSeksjon = {
  id: "eos-arbeidsforhold",
  faktum: [
    {
      id: "faktum.eos-arbeid-siste-36-mnd",
      type: "boolean",
      answerOptions: [
        { id: "faktum.eos-arbeid-siste-36-mnd.svar.ja" },
        { id: "faktum.eos-arbeid-siste-36-mnd.svar.nei" },
      ],
      subFaktum: [
        {
          id: "faktum.eos-arbeidsforhold",
          type: "generator",
          faktum: [
            {
              id: "faktum.eos-arbeidsforhold-arbeidsgivernavn",
              type: "tekst",
            },
            {
              id: "faktum.eos-arbeidsforhold-land",
              type: "dropdown",
              answerOptions: [], // liste over alle land? generere maskinelt? quiz?
              subFaktum: [], // her bør vi få inn subfaktum om PIN i det lander, hvis dropdown svaret inneholder et eos-land, logikk?
            },
            {
              id: "faktum.eos-arbeidsforhold-personnummer",
              type: "tekst"
            },
            {
              id: "faktum.eos-arbeidsforhold-varighet",
              type: "periode"
            },
          ],
          requiredAnswerIds: ["faktum.eos-arbeid-siste-36-mnd.svar.ja"],
        },
      ],
    },
  ],
};
