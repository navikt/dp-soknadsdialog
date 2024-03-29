export const barnetillegg = {
  id: "barnetillegg",
  fakta: [
    {
      id: "faktum.barn-liste",
      type: "generator",
      fakta: [
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
          id: "faktum.barn-bostedsland",
          type: "land",
          answerOptions: [
            {
              id: "faktum.barn-bostedsland.svar.eos",
              countries: [], // HER MÅ ALLE ALPHA3 KODER FOR LAND LIGGE FOR DENNE GRUPPEN
            },
            {
              id: "faktum.barn-bostedsland.svar.utenfor-eos",
              countries: [], // HER MÅ ALLE ALPHA3 KODER FOR LAND LIGGE FOR DENNE GRUPPEN
            },
            {
              id: "faktum.barn-bostedsland.svar.norge",
              countries: [], // HER MÅ ALLE ALPHA3 KODER FOR LAND LIGGE FOR DENNE GRUPPEN
            },
          ],
        },
        {
          id: "faktum.forsoerger-du-barnet",
          type: "boolean",
          answerOptions: [
            { id: "faktum.forsoerger-du-barnet.svar.ja" },
            { id: "faktum.forsoerger-du-barnet.svar.nei" },
          ],
          subFakta: [
            {
              id: "faktum.barn-aarsinntekt-over-1g",
              type: "boolean",
              answerOptions: [
                {
                  id: "faktum.barn-aarsinntekt-over-1g.svar.nei",
                },
                {
                  id: "faktum.barn-aarsinntekt-over-1g.svar.ja",
                },
              ],
              subFakta: [
                {
                  id: "faktum.barn-inntekt",
                  type: "int",
                  requiredAnswerIds: ["faktum.barn-aarsinntekt-over-1g.svar.ja"],
                },
              ],
              requiredAnswerIds: ["faktum.forsoerger-du-barnet.svar.ja"],
            },
          ],
        },
      ],
    },
  ],
};
