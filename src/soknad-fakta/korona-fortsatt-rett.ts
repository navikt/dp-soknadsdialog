import { BlueprintSeksjon } from "./soknad";

export const koronaFortsattRett: BlueprintSeksjon = {
  id: "korona-fortsatt-rett",
  faktum: [
    {
      id: "faktum.oppbrukt-dagpengeperiode",
      type: "boolean",
      answerOptions: [
        { id: "faktum.oppbrukt-dagpengeperiode.svar.ja" },
        { id: "faktum.oppbrukt-dagpengeperiode.svar.nei" },
      ],
      subFaktum: [
        {
          id: "faktum.onsker-fortsette-avsluttet-periode",
          type: "boolean",
          requiredAnswerIds: ["faktum.oppbrukt-dagpengeperiode.svar.ja"],
          answerOptions: [
            { id: "faktum.onsker-fortsette-avsluttet-periode.svar.ja" },
            { id: "faktum.onsker-fortsette-avsluttet-periode.svar.nei" },
          ],
          subFaktum: [],
        },
      ],
    },
  ],
};
