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
          sannsynliggjoresAv: [],
        },
        {
          id: "2",
          type: "int",
          beskrivendeId: "heltall2",
          roller: ["søker"],
          sannsynliggjoresAv: [],
        },
        {
          id: "15",
          type: "tekst",
          beskrivendeId: "tekst15",
          roller: ["søker"],
          sannsynliggjoresAv: [],
        },
        {
          id: "16",
          type: "periode",
          beskrivendeId: "periode16",
          roller: ["søker"],
          sannsynliggjoresAv: [],
        },
        {
          id: "17",
          type: "periode",
          beskrivendeId: "pågåendePeriode17",
          roller: ["søker"],
          sannsynliggjoresAv: [],
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
          sannsynliggjoresAv: [],
        },
        {
          id: "5",
          type: "generator",
          beskrivendeId: "generator5",
          roller: ["søker"],
          sannsynliggjoresAv: [],
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
          sannsynliggjoresAv: [],
        },
        {
          id: "11",
          type: "envalg",
          beskrivendeId: "envalg11",
          roller: ["søker"],
          sannsynliggjoresAv: [],
          gyldigeValg: ["envalg11.valg1", "envalg11.valg2"],
        },
        {
          id: "14",
          type: "generator",
          beskrivendeId: "generator14",
          roller: ["søker"],
          sannsynliggjoresAv: [],
          templates: [
            {
              id: "12",
              type: "localdate",
              beskrivendeId: "dato12",
              roller: ["søker"],
              sannsynliggjoresAv: [],
            },
            {
              id: "13",
              type: "inntekt",
              beskrivendeId: "inntekt13",
              roller: ["søker"],
              sannsynliggjoresAv: [],
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
          sannsynliggjoresAv: [],
        },
        {
          id: "8",
          type: "inntekt",
          beskrivendeId: "inntekt8",
          roller: ["nav"],
          sannsynliggjoresAv: [],
        },
        {
          id: "9",
          type: "localdate",
          beskrivendeId: "dato9",
          roller: ["nav"],
          sannsynliggjoresAv: [],
        },
      ],
    },
  ],
};
