import { MockDataSeksjon } from "./soknad";

export const koronaFortsattRett: MockDataSeksjon = {
  id: "korona-fortsatt-rett",
  faktum: [
    {
      id: "faktum.oppbrukt-dagpengeperiode",
      seksjonId: "korona-fortsatt-rett",
      type: "boolean",
      answerOptions: [
        { id: "faktum.oppbrukt-dagpengeperiode.svar.ja" },
        { id: "faktum.oppbrukt-dagpengeperiode.svar.nei" },
      ],
      subFaktum: [
        {
          id: "faktum.onsker-fortsette-avsluttet-periode",
          seksjonId: "korona-fortsatt-rett",
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
