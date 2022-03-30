import { MockDataSeksjon } from "./soknad";
export const bostedsland: MockDataSeksjon = {
  id: "bostedsland",
  faktum: [
    {
      id: "faktum.hvilket-land-bor-du-i",
      type: "land",
      answerOptions: [], //todo:fyll ut all verdens land fra en eller annen fil
      subFaktum: [
        {
          id: "faktum.reist-tilbake-etter-arbeidsledig",
          type: "boolean",
          answerOptions: [
            { id: "faktum.reist-tilbake-etter-arbeidsledig.svar.ja" },
            { id: "faktum.reist-tilbake-etter-arbeidsledig.svar.nei" },
          ],
          subFaktum: [
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
              type: "envalg",
              answerOptions: [
                { id: "faktum.reist-tilbake-en-gang-eller-mer.svar.ja" },
                { id: "faktum.reist-tilbake-en-gang-eller-mer.svar.nei" },
                { id: "faktum.reist-tilbake-en-gang-eller-mer.svar.nei-men-rotasjon" },
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
