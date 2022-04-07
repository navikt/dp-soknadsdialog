import { BlueprintSeksjon } from "./soknad";
export const bostedsland: BlueprintSeksjon = {
  id: "bostedsland",
  fakta: [
    {
      id: "faktum.hvilket-land-bor-du-i",
      type: "land",
      subFakta: [
        {
          id: "faktum.reist-tilbake-etter-arbeidsledig",
          type: "boolean",
          answerOptions: [
            { id: "faktum.reist-tilbake-etter-arbeidsledig.svar.ja" },
            { id: "faktum.reist-tilbake-etter-arbeidsledig.svar.nei" },
          ],
          subFakta: [
            {
              id: "faktum.reist-tilbake-periode",
              type: "periode",
              requiredAnswerIds: ["faktum.reist-tilbake-etter-arbeidsledig.svar.ja"],
            },
            {
              id: "faktum.reist-tilbake-aarsak",
              type: "tekst",
              requiredAnswerIds: ["faktum.reist-tilbake-etter-arbeidsledig.svar.ja"],
            },
            {
              id: "faktum.reist-tilbake-en-gang-eller-mer",
              type: "boolean",
              answerOptions: [
                { id: "faktum.reist-tilbake-en-gang-eller-mer.svar.ja" },
                { id: "faktum.reist-tilbake-en-gang-eller-mer.svar.nei" },
              ],
              subFakta: [
                {
                  id: "faktum.reist-i-takt-med-rotasjon",
                  type: "boolean",
                  answerOptions: [
                    { id: "faktum.reist-i-takt-med-rotasjon.svar.ja" },
                    { id: "faktum.reist-i-takt-med-rotasjon.svar.nei" },
                  ],
                  requiredAnswerIds: ["faktum.reist-tilbake-en-gang-eller-mer.svar.nei"],
                },
              ],
              requiredAnswerIds: [
                "faktum.reist-tilbake-etter-arbeidsledig.svar.ja",
                "faktum.reist-tilbake-etter-arbeidsledig.svar.nei",
              ],
            },
          ],
          requiredAnswerIds: ["land.eos-eller-sveits"],
        },
      ],
    },
  ],
};
