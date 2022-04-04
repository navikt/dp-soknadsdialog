import { BlueprintSeksjon } from "./soknad";

export const barnetillegg: BlueprintSeksjon = {
  id: "barnetillegg", //todo: hvordan takler vi logikk rundt allerede genererte barn og oppfølgingspørsmålene der
  faktum: [
    {
      id: "faktum.barn-liste",
      type: "generator",
      faktum: [
        {
          id: "faktum.barn-fornavn-mellomnavn",
          type: "tekst",
        },
        {
          id: "faktum.barn-etternavn",
          type: "tekst",
        },
        {
          id: "faktum.barn-foedselsdato",
          type: "localdate",
        },
        {
          id: "faktum.barn-statsborgerskap",
          type: "land",
          answerOptions: [], //todo: insert landliste
        },
        {
          id: "faktum.forsoerger-du-barnet",
          type: "boolean",
          answerOptions: [
            { id: "faktum.forsoerger-du-barnet.svar.ja" }, //todo: trigger dokumentkrav foedselsattest
            { id: "faktum.forsoerger-du-barnet.svar.nei" },
          ],
          subFaktum: [
            {
              id: "faktum.barn-aarsinntekt-over-1g",
              type: "boolean",
              requiredAnswerIds: ["faktum.forsoerger-du-barnet.svar.ja"],
              answerOptions: [
                {
                  id: "faktum.barn-aarsinntekt-over-1g.svar.nei",
                },
                {
                  id: "faktum.barn-aarsinntekt-over-1g.svar.ja",
                },
              ],
              subFaktum: [
                {
                  id: "faktum.barn-inntekt",
                  type: "int",
                  requiredAnswerIds: ["faktum.barn-aarsinntekt-over-1g.svar.ja"],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
