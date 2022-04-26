import { BlueprintSeksjon } from "./soknad";
export const bostedsland: BlueprintSeksjon = {
  id: "bostedsland",
  fakta: [
    {
      id: "faktum.hvilket-land-bor-du-i",
      type: "land",
      answerOptions: [
        {
          id: "faktum.hvilket-land-bor-du-i.svar.eos-sveits",
          countries: [], // HER MÅ ALLE ALPHA3 KODER FOR LAND LIGGE FOR DENNE GRUPPEN
        },
        {
          id: "faktum.hvilket-land-bor-du-i.svar.norge-svalbard",
          countries: [], // HER MÅ ALLE ALPHA3 KODER FOR LAND LIGGE FOR DENNE GRUPPEN
        },
        {
          id: "faktum.hvilket-land-bor-du-i.svar.storbritania",
          countries: [], // HER MÅ ALLE ALPHA3 KODER FOR LAND LIGGE FOR DENNE GRUPPEN
        },
        {
          id: "faktum.hvilket-land-bor-du-i.svar.utenfor-eos",
          countries: [], // HER MÅ ALLE ALPHA3 KODER FOR LAND LIGGE FOR DENNE GRUPPEN
        },
      ],
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
