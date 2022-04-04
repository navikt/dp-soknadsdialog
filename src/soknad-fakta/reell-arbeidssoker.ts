import { BlueprintSeksjon } from "./soknad";

export const reellArbeidssoker: BlueprintSeksjon = {
  id: "reell-arbeidsoker",
  faktum: [
    {
      id: "faktum.jobbe-hel-deltid",
      type: "boolean",
      answerOptions: [
        { id: "faktum.jobbe-hel-deltid.svar.ja" },
        { id: "faktum.jobbe-hel-deltid.svar.nei" },
      ],
      subFaktum: [
        {
          id: "faktum.kun-deltid-aarsak",
          type: "flervalg",
          requiredAnswerIds: ["faktum.jobbe-hel-deltid.svar.nei"],
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
            { id: "faktum.kun-deltid-aarsak.svar.har-fylt-60" },
            { id: "faktum.kun-deltid-aarsak.svar.annen-situasjon" },
          ],
          subFaktum: [
            {
              id: "faktum.kort-om-hvorfor-kun-deltid",
              type: "tekst",
              requiredAnswerIds: ["faktum.kun-deltid-aarsak.svar.annen-situasjon"],
            },
          ],
        },
        {
          id: "faktum.kun-deltid-aarsak-antall-timer",
          type: "int",
          requiredAnswerIds: ["faktum.jobbe-hel-deltid.svar.nei"],
        },
      ],
    },
    {
      id: "faktum.jobbe-hele-norge",
      type: "boolean",
      answerOptions: [
        { id: "faktum.jobbe-hele-norge.svar.ja" },
        { id: "faktum.jobbe-hele-norge.svar.nei" },
      ],
      subFaktum: [
        {
          id: "faktum.ikke-jobbe-hele-norge",
          type: "flervalg",
          requiredAnswerIds: ["faktum.jobbe-hele-norge.svar.nei"],
          answerOptions: [
            { id: "faktum.ikke-jobbe-hele-norge.svar.redusert-helse" },
            {
              id: "faktum.ikke-jobbe-hele-norge.svar.omsorg-baby",
            },
            {
              id: "faktum.ikke-jobbe-hele-norge.svar.eneansvar-barn",
            },
            {
              id: "faktum.ikke-jobbe-hele-norge.svar.omsorg-barn-spesielle-behov",
            },
            {
              id: "faktum.ikke-jobbe-hele-norge.svar.skift-turnus",
            },
            { id: "faktum.ikke-jobbe-hele-norge.svar.har-fylt-60" },
            { id: "faktum.ikke-jobbe-hele-norge.svar.annen-situasjon" },
          ],
          subFaktum: [
            {
              id: "faktum.kort-om-hvorfor-ikke-jobbe-hele-norge",
              type: "tekst",
              requiredAnswerIds: ["faktum.ikke-jobbe-hele-norge.svar.annen-situasjon"],
            },
          ],
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
    },
    {
      id: "faktum.bytte-yrke-ned-i-lonn",
      type: "boolean",
      answerOptions: [
        { id: "faktum.ethvert-arbeid.svar.ja" },
        { id: "faktum.ethvert-arbeid.svar.nei" },
      ],
    },
  ],
};
