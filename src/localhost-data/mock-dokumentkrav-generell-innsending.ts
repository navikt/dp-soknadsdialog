export const mockDokumentkravGenerellInnsending = {
  soknad_uuid: "fd71ea40-f07a-45b6-9857-39abdffca3ae",
  krav: [
    {
      id: "1005",
      beskrivendeId: "dokumentasjon",
      fakta: [
        {
          id: "1003",
          svar: "123",
          type: "tekst",
          roller: ["søker"],
          readOnly: false,
          beskrivendeId: "faktum.tittel",
          sannsynliggjoresAv: [
            {
              id: "1005",
              type: "dokument",
              roller: ["søker"],
              readOnly: true,
              beskrivendeId: "dokumentasjon",
              sannsynliggjoresAv: [],
            },
          ],
        },
      ],
      filer: [],
      gyldigeValg: [
        "dokumentkrav.svar.send.naa",
        "dokumentkrav.svar.send.senere",
        "dokumentkrav.svar.sendt.tidligere",
        "dokumentkrav.svar.sender.ikke",
        "dokumentkrav.svar.andre.sender",
      ],
    },
  ],
};
