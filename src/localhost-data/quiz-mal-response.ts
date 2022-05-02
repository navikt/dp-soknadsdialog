export const quizMalResponse = {
  seksjoner: [
    {
      beskrivendeId: "seksjon1",
      fakta: [
        {
          id: "1",
          type: "boolean",
          beskrivendeId: "boolsk1",
          roller: ["søker"],
        },
        {
          id: "2",
          type: "int",
          beskrivendeId: "heltall2",
          roller: ["søker"],
        },
        {
          id: "15",
          type: "tekst",
          beskrivendeId: "tekst15",
          roller: ["søker"],
        },
        {
          id: "16",
          type: "periode",
          beskrivendeId: "periode16",
          roller: ["søker"],
        },
        {
          id: "17",
          type: "periode",
          beskrivendeId: "pågåendePeriode17",
          roller: ["søker"],
        },
      ],
    },
    {
      beskrivendeId: "seksjon2",
      fakta: [
        {
          id: "6",
          type: "double",
          beskrivendeId: "desimaltall6",
          roller: ["søker"],
        },
        {
          id: "5",
          type: "generator",
          beskrivendeId: "generator5",
          roller: ["søker"],
          templates: [
            {
              id: "3",
              type: "int",
              beskrivendeId: "heltall3",
              roller: ["søker"],
            },
            {
              id: "4",
              type: "localdate",
              beskrivendeId: "dato4",
              roller: ["søker"],
            },
          ],
        },
      ],
    },
    {
      beskrivendeId: "seksjon3",
      fakta: [
        {
          id: "10",
          type: "flervalg",
          beskrivendeId: "flervalg10",
          roller: ["søker"],
          gyldigeValg: ["flervalg10.valg1", "flervalg10.valg2", "flervalg10.valg3"],
        },
        {
          id: "11",
          type: "envalg",
          beskrivendeId: "envalg11",
          roller: ["søker"],
          gyldigeValg: ["envalg11.valg1", "envalg11.valg2"],
        },
        {
          id: "14",
          type: "generator",
          beskrivendeId: "generator14",
          roller: ["søker"],
          templates: [
            {
              id: "12",
              type: "localdate",
              beskrivendeId: "dato12",
              roller: ["søker"],
            },
            {
              id: "13",
              type: "inntekt",
              beskrivendeId: "inntekt13",
              roller: ["søker"],
            },
          ],
        },
      ],
    },
    {
      beskrivendeId: "nav",
      fakta: [
        {
          id: "7",
          type: "dokument",
          beskrivendeId: "dokument7",
          roller: ["nav"],
        },
        {
          id: "8",
          type: "inntekt",
          beskrivendeId: "inntekt8",
          roller: ["nav"],
        },
        {
          id: "9",
          type: "localdate",
          beskrivendeId: "dato9",
          roller: ["nav"],
        },
      ],
    },
  ],
};
