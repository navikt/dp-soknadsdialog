export const mockGenerellInnsending = {
  "@id": "152f6959-0929-444f-90ed-a5ffcc6b7041",
  ferdig: true,
  seksjoner: [
    {
      fakta: [
        {
          id: "1001",
          svar: "faktum.generell-innsending.hvorfor.svar.klage",
          type: "envalg",
          roller: ["søker"],
          readOnly: false,
          gyldigeValg: [
            "faktum.generell-innsending.hvorfor.svar.klage",
            "faktum.generell-innsending.hvorfor.svar.ettersending",
            "faktum.generell-innsending.hvorfor.svar.endring",
            "faktum.generell-innsending.hvorfor.svar.annet",
          ],
          beskrivendeId: "faktum.generell-innsending.hvorfor",
          sannsynliggjoresAv: [],
        },
        {
          id: "1003",
          svar: "123",
          type: "tekst",
          roller: ["søker"],
          readOnly: false,
          beskrivendeId: "faktum.generell-innsending.tittel-paa-dokument",
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
      ferdig: true,
      beskrivendeId: "generell-innsending",
    },
  ],
  "@opprettet": "2022-11-14T15:58:11.400328686",
  versjon_id: 6,
  "@event_name": "søker_oppgave",
  søknad_uuid: "fd71ea40-f07a-45b6-9857-39abdffca3ae",
  versjon_navn: "Innsending",
  fødselsnummer: "12837798289",
  "@forårsaket_av": {
    id: "783ed8d8-9cdf-4ef1-8577-056a96789bbc",
    opprettet: "2022-11-14T15:58:11.315441086",
    event_name: "faktum_svar",
  },
  antallSeksjoner: 1,
  system_read_count: 1,
  system_participating_services: [
    {
      id: "152f6959-0929-444f-90ed-a5ffcc6b7041",
      time: "2022-11-14T15:58:11.400571152",
      image: "ghcr.io/navikt/dp-quiz/dp-quiz-mediator:38b0c66491d50050a272b09b08652929e686183d",
      service: "dp-quiz-mediator",
      instance: "dp-quiz-mediator-747654b7d8-d9pdv",
    },
    {
      id: "152f6959-0929-444f-90ed-a5ffcc6b7041",
      time: "2022-11-14T15:58:11.407250898",
      image: "ghcr.io/navikt/dp-soknad:0442f96ebe43b90f30163d754e711e674d41eafa",
      service: "dp-soknad",
      instance: "dp-soknad-754f5669c8-jpxsf",
    },
  ],
};
