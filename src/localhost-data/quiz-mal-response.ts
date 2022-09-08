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
          sannsynliggjøresAv: [],
        },
        {
          id: "2",
          type: "int",
          beskrivendeId: "heltall2",
          roller: ["søker"],
          sannsynliggjøresAv: [],
        },
        {
          id: "15",
          type: "tekst",
          beskrivendeId: "tekst15",
          roller: ["søker"],
          sannsynliggjøresAv: [],
        },
        {
          id: "16",
          type: "periode",
          beskrivendeId: "periode16",
          roller: ["søker"],
          sannsynliggjøresAv: [],
        },
        {
          id: "17",
          type: "periode",
          beskrivendeId: "pågåendePeriode17",
          roller: ["søker"],
          sannsynliggjøresAv: [],
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
          sannsynliggjøresAv: [],
        },
        {
          id: "5",
          type: "generator",
          beskrivendeId: "generator5",
          roller: ["søker"],
          sannsynliggjøresAv: [],
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
          sannsynliggjøresAv: [],
        },
        {
          id: "11",
          type: "envalg",
          beskrivendeId: "envalg11",
          roller: ["søker"],
          sannsynliggjøresAv: [],
          gyldigeValg: ["envalg11.valg1", "envalg11.valg2"],
        },
        {
          id: "14",
          type: "generator",
          beskrivendeId: "generator14",
          roller: ["søker"],
          sannsynliggjøresAv: [],
          templates: [
            {
              id: "12",
              type: "localdate",
              beskrivendeId: "dato12",
              roller: ["søker"],
              sannsynliggjøresAv: [],
            },
            {
              id: "13",
              type: "inntekt",
              beskrivendeId: "inntekt13",
              roller: ["søker"],
              sannsynliggjøresAv: [],
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
          sannsynliggjøresAv: [],
        },
        {
          id: "8",
          type: "inntekt",
          beskrivendeId: "inntekt8",
          roller: ["nav"],
          sannsynliggjøresAv: [],
        },
        {
          id: "9",
          type: "localdate",
          beskrivendeId: "dato9",
          roller: ["nav"],
          sannsynliggjøresAv: [],
        },
      ],
    },
  ],
};
