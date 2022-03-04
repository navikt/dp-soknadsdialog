import { MockDataSeksjon } from "./soknad";

export const egenNaering: MockDataSeksjon = {
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
          requiredAnswerIds: ["faktum.driver-du-egen-naering.svar.ja"],
          faktum: [{ id: "faktum.egen-naering-organisasjonsnummer", type: "int" }],
        },
        {
          id: "faktum.egen-naering-arbeidstimer",
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
          requiredAnswerIds: ["faktum.driver-du-eget-gaardsbruk.svar.ja"],
          answerOptions: [
            { id: "faktum.eget-gaardsbruk-type-gaardsbruk.svar.dyr" },
            { id: "faktum.eget-gaardsbruk-type-gaardsbruk.svar.jord" },
            { id: "faktum.eget-gaardsbruk-type-gaardsbruk.svar.skog" },
            { id: "faktum.eget-gaardsbruk-type-gaardsbruk.svar.annet" },
          ],
        },
        {
          id: "faktum.eget-gaardsbruk-hvem-eier",
          type: "flervalg",
          requiredAnswerIds: ["faktum.driver-du-eget-gaardsbruk.svar.ja"],
          answerOptions: [
            { id: "faktum.eget-gaardsbruk-hvem-eier.svar.selv" },
            { id: "faktum.eget-gaardsbruk-hvem-eier.svar.ektefelle-samboer" },
            { id: "faktum.eget-gaardsbruk-hvem-eier.svar.andre" },
          ],
        },
        {
          id: "faktum.eget-gaardsbruk-arbeidstimer",
          type: "double",
          requiredAnswerIds: ["faktum.driver-du-eget-gaardsbruk.svar.ja"],
        },
        {
          id: "faktum.eget-gaardsbruk-arbeidsaar",
          type: "int", //todo: siste fem år? en dynamisk dropdown som endrer seg hvert år altså. Hvordan løser vi dette?
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
