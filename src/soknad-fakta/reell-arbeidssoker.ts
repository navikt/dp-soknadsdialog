import { MockDataSeksjon } from "./soknad";

export const reellArbeidssoker: MockDataSeksjon = {
  id: "reell-arbeidsoker",
  faktum: [
    {
      id: "faktum.hel-deltid",
      type: "boolean",
      answerOptions: [{ id: "faktum.hel-deltid.svar.ja" }, { id: "faktum.hel-deltid.svar.nei" }],
      subFaktum: [
        {
          id: "faktum.kun-deltid-aarsak",
          type: "flervalg",
          requiredAnswerIds: ["faktum.hel-deltid.svar.nei"],
          answerOptions: [
            { id: "faktum.kun-deltid-aarsak.svar.redusert-helse" },
            {
              id: "faktum.kun-deltid-aarsak.svar.omsorg-baby",
            },
            {
              id: "faktum.kun-deltid-aarsak.svar.eneansvar-barn",
            },
            {
              id: "faktum.kun-deltid-aarsak.svar.omsorg-barn-spesielle-behov",
            },
            { id: "faktum.kun-deltid-aarsak.svar.skift-turnus" },
            { id: "faktum.kun-deltid-aarsak.svar.annen-situasjon" },
          ],
          subFaktum: [],
        },
        {
          id: "faktum.kun-deltid-aarsak-antall-timer",
          type: "int",
          requiredAnswerIds: ["faktum.hel-deltid.svar.nei"],
        },
      ],
    },
    {
      id: "faktum.hele-norge",
      type: "boolean",
      answerOptions: [{ id: "faktum.hele-norge.svar.ja" }, { id: "faktum.hele-norge.svar.nei" }],
      subFaktum: [
        {
          id: "faktum.ikke-hele-norge",
          type: "flervalg",
          requiredAnswerIds: ["faktum.hele-norge.svar.nei"],
          answerOptions: [
            { id: "faktum.ikke-hele-norge.svar.redusert-helse" },
            {
              id: "faktum.ikke-hele-norge.svar.omsorg-baby",
            },
            {
              id: "faktum.ikke-hele-norge.svar.eneansvar-barn",
            },
            {
              id: "faktum.ikke-hele-norge.svar.omsorg-barn-spesielle-behov",
            },
            { id: "faktum.ikke-hele-norge.svar.utenfor-naeromraadet" },
            { id: "faktum.ikke-hele-norge.svar.annen-situasjon" },
          ],
          subFaktum: [],
        },
      ],
    },
    {
      id: "faktum.alle-typer-arbeid",
      type: "boolean",
      answerOptions: [
        { id: "faktum.alle-typer-arbeid.svar.ja" },
        { id: "faktum.alle-typer-arbeid.svar.nei" },
      ],
      subFaktum: [
        {
          id: "faktum.ikke-denne-type-arbeid",
          type: "tekst",
          requiredAnswerIds: ["faktum.alle-typer-arbeid.svar.nei"],
        },
      ],
    },
    {
      id: "faktum.ethvert-arbeid",
      type: "boolean",
      answerOptions: [
        { id: "faktum.ethvert-arbeid.svar.ja" },
        { id: "faktum.ethvert-arbeid.svar.nei" },
      ],
      subFaktum: [],
    },
  ],
};
