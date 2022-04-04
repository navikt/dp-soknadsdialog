import { BlueprintDataSeksjon } from "./soknad";

export const egenNaering: BlueprintDataSeksjon = {
  id: "egen-naering",
  faktum: [
    {
      id: "faktum.driver-du-egen-naering",
      type: "boolean",
      answerOptions: [
        { id: "faktum.driver-du-egen-naering.svar.ja" },
        { id: "faktum.driver-du-egen-naering.svar.nei" },
      ],
      subFaktum: [
        {
          id: "faktum.egen-naering-organisasjonsnummer-liste",
          type: "generator",
          faktum: [{ id: "faktum.egen-naering-organisasjonsnummer", type: "int" }],
          requiredAnswerIds: ["faktum.driver-du-egen-naering.svar.ja"],
        },
        {
          id: "faktum.egen-naering-arbeidstimer-for",
          type: "double",
          requiredAnswerIds: ["faktum.driver-du-egen-naering.svar.ja"], //todo: vedleggskrav
        },
        {
          id: "faktum.egen-naering-arbeidstimer-naa",
          type: "double",
          requiredAnswerIds: ["faktum.driver-du-egen-naering.svar.ja"], //todo: vedleggskrav
        },
      ],
    },
    {
      id: "faktum.driver-du-eget-gaardsbruk",
      type: "boolean",
      answerOptions: [
        { id: "faktum.driver-du-eget-gaardsbruk.svar.ja" }, //todo: dokumentfaktumKrav arbeidstimer
        { id: "faktum.driver-du-eget-gaardsbruk.svar.nei" },
      ],
      subFaktum: [
        {
          id: "faktum.eget-gaardsbruk-organisasjonsnummer",
          type: "int",
          requiredAnswerIds: ["faktum.driver-du-eget-gaardsbruk.svar.ja"],
        },
        {
          id: "faktum.eget-gaardsbruk-type-gaardsbruk",
          type: "flervalg",
          answerOptions: [
            { id: "faktum.eget-gaardsbruk-type-gaardsbruk.svar.dyr" },
            { id: "faktum.eget-gaardsbruk-type-gaardsbruk.svar.jord" },
            { id: "faktum.eget-gaardsbruk-type-gaardsbruk.svar.skog" },
            { id: "faktum.eget-gaardsbruk-type-gaardsbruk.svar.annet" },
          ],
          requiredAnswerIds: ["faktum.driver-du-eget-gaardsbruk.svar.ja"],
        },
        {
          id: "faktum.eget-gaardsbruk-hvem-eier",
          type: "flervalg",
          answerOptions: [
            { id: "faktum.eget-gaardsbruk-hvem-eier.svar.selv" },
            { id: "faktum.eget-gaardsbruk-hvem-eier.svar.ektefelle-samboer" },
            { id: "faktum.eget-gaardsbruk-hvem-eier.svar.andre" },
          ],
          requiredAnswerIds: ["faktum.driver-du-eget-gaardsbruk.svar.ja"],
          subFaktum: [
            {
              id: "faktum.eget-gaardsbruk-jeg-andel-inntekt",
              type: "double",
              requiredAnswerIds: ["faktum.eget-gaardsbruk-hvem-eier.svar.selv"],
            },
            {
              id: "faktum.eget-gaardsbruk-ektefelle-samboer-andel-inntekt",
              type: "double",
              requiredAnswerIds: ["faktum.eget-gaardsbruk-hvem-eier.svar.ektefelle-samboer"],
            },
            {
              id: "faktum.eget-gaardsbruk-andre-andel-inntekt",
              type: "double",
              requiredAnswerIds: ["faktum.eget-gaardsbruk-hvem-eier.svar.andre"],
            },
          ],
        },
        {
          id: "faktum.eget-gaardsbruk-arbeidstimer-aar",
          type: "double",
          requiredAnswerIds: ["faktum.driver-du-eget-gaardsbruk.svar.ja"],
        },
        {
          id: "faktum.eget-gaardsbruk-arbeidsaar-for-timer",
          type: "int",
          requiredAnswerIds: ["faktum.driver-du-eget-gaardsbruk.svar.ja"],
        },
        {
          id: "faktum.eget-gaardsbruk-arbeidstimer-beregning",
          type: "tekst",
          requiredAnswerIds: ["faktum.driver-du-eget-gaardsbruk.svar.ja"],
        },
      ],
    },
  ],
};
