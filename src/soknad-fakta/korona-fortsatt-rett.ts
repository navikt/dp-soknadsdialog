export const koronaFortsattRett = {
  id: "korona-fortsatt-rett",
  fakta: [
    {
      id: "faktum.oppbrukt-dagpengeperiode",
      type: "boolean",
      answerOptions: [
        { id: "faktum.oppbrukt-dagpengeperiode.svar.ja" },
        { id: "faktum.oppbrukt-dagpengeperiode.svar.nei" },
      ],
      subFakta: [
        {
          id: "faktum.onsker-fortsette-avsluttet-periode",
          type: "boolean",
          requiredAnswerIds: ["faktum.oppbrukt-dagpengeperiode.svar.ja"],
          answerOptions: [
            { id: "faktum.onsker-fortsette-avsluttet-periode.svar.ja" },
            { id: "faktum.onsker-fortsette-avsluttet-periode.svar.nei" },
          ],
          subFakta: [],
        },
      ],
    },
  ],
};
