import { BlueprintSeksjon } from "./soknad";
// kan denne egentlig bakes inn i arbeidsforhold?
export const eosArbeidsforhold: BlueprintSeksjon = {
  id: "eos-arbeidsforhold",
  fakta: [
    {
      id: "faktum.eos-arbeid-siste-36-mnd",
      type: "boolean",
      answerOptions: [
        { id: "faktum.eos-arbeid-siste-36-mnd.svar.ja" },
        { id: "faktum.eos-arbeid-siste-36-mnd.svar.nei" },
      ],
      subFakta: [
        {
          id: "faktum.eos-arbeidsforhold",
          type: "generator",
          fakta: [
            {
              id: "faktum.eos-arbeidsforhold-arbeidsgivernavn",
              type: "tekst",
            },
            {
              id: "faktum.eos-arbeidsforhold-land",
              type: "land",
            },
            {
              id: "faktum.eos-arbeidsforhold-personnummer",
              type: "tekst",
            },
            {
              id: "faktum.eos-arbeidsforhold-varighet",
              type: "periode",
            },
          ],
          requiredAnswerIds: ["faktum.eos-arbeid-siste-36-mnd.svar.ja"],
        },
      ],
    },
  ],
};
