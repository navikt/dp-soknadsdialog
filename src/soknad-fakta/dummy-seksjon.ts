import { BlueprintSeksjon } from "./soknad";

export const dummySeksjon: BlueprintSeksjon = {
  id: "dummy-seksjon-data",
  fakta: [
    {
      id: "faktum.dummy-boolean",
      type: "boolean",
      answerOptions: [
        { id: "faktum.dummy-boolean.svar.ja" },
        { id: "faktum.dummy-boolean.svar.nei" },
      ],
    },
    {
      id: "faktum.dummy-envalg",
      type: "envalg",
      answerOptions: [
        { id: "faktum.dummy-envalg.svar.ja" },
        { id: "faktum.dummy-envalg.svar.nei" },
        { id: "faktum.dummy-envalg.svar.vetikke" },
      ],
      subFakta: [
        {
          id: "faktum.dummy-subfaktum-tekst",
          type: "tekst",
          requiredAnswerIds: ["faktum.dummy-envalg.svar.ja"],
        },
      ],
    },
    {
      id: "faktum.dummy-flervalg",
      type: "flervalg",
      answerOptions: [
        { id: "faktum.dummy-flervalg.svar.1" },
        { id: "faktum.dummy-flervalg.svar.2" },
        { id: "faktum.dummy-flervalg.svar.3" },
      ],
    },
    {
      id: "faktum.dummy-int",
      type: "int",
    },
    {
      id: "faktum.dummy-double",
      type: "double",
    },
    {
      id: "faktum.dummy-tekst",
      type: "tekst",
    },
    {
      id: "faktum.dummy-localdate",
      type: "localdate",
    },
    {
      id: "faktum.dummy-periode",
      type: "periode",
    },
    {
      id: "faktum.dummy-land",
      type: "land",
    },
    {
      id: "faktum.dummy-generator",
      type: "generator",
      fakta: [
        {
          id: "faktum.generator-dummy-boolean",
          type: "boolean",
          answerOptions: [
            { id: "faktum.generator-dummy-boolean.svar.ja" },
            { id: "faktum.generator-dummy-boolean.svar.nei" },
          ],
        },
        {
          id: "faktum.generator-dummy-envalg",
          type: "envalg",
          answerOptions: [
            { id: "faktum.generator-dummy-envalg.svar.ja" },
            { id: "faktum.generator-dummy-envalg.svar.nei" },
            { id: "faktum.generator-dummy-envalg.svar.vetikke" },
          ],
          subFakta: [
            {
              id: "faktum.generator-dummy-subfaktum-tekst",
              type: "tekst",
              requiredAnswerIds: ["faktum.generator-dummy-envalg.svar.ja"],
            },
          ],
        },
        {
          id: "faktum.generator-dummy-flervalg",
          type: "flervalg",
          answerOptions: [
            { id: "faktum.generator-dummy-flervalg.svar.1" },
            { id: "faktum.generator-dummy-flervalg.svar.2" },
            { id: "faktum.generator-dummy-flervalg.svar.3" },
          ],
        },
        {
          id: "faktum.generator-dummy-int",
          type: "int",
        },
        {
          id: "faktum.generator-dummy-double",
          type: "double",
        },
        {
          id: "faktum.generator-dummy-tekst",
          type: "tekst",
        },
        {
          id: "faktum.generator-dummy-localdate",
          type: "localdate",
        },
        {
          id: "faktum.generator-dummy-periode",
          type: "periode",
        },
        {
          id: "faktum.generator-dummy-land",
          type: "land",
        },
      ],
    },
  ],
};
