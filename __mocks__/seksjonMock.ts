interface Faktum {
  navn: string;
  id: string;
  roller: string[];
  type: string;
  godkjenner?: string[];
  svar?: undefined;
}

const faktum = ({ navn, id, type, roller, godkjenner }: Faktum) => ({
  navn,
  id,
  roller,
  type,
  godkjenner,
});

const søknader = new Map();
export const getFaktaFor = (søknad, seksjon) => {
  const key = `${søknad}-${seksjon}`;

  if (!søknader.has(key)) {
    søknader.set(key, seksjon1());
  }
  return søknader.get(key);
};

const seksjon1 = () => [
  faktum({
    navn: "Som hovedregel må du være villig til å ta både hel- og deltidsjobb for å ha rett til dagpenger",
    id: "2",
    roller: ["søker"],
    type: "boolean",
    godkjenner: [],
  }),
  faktum({
    navn: "Som hovedregel må du være villig til å ta arbeid i hele Norge for å ha rett til dagpenger",
    id: "3",
    roller: ["søker"],
    type: "boolean",
    godkjenner: [],
  }),
  faktum({
    navn: "Som hovedregel må du kunne ta alle typer arbeid for å ha rett til dagpenger",
    id: "4",
    roller: ["søker"],
    type: "boolean",
    godkjenner: [],
  }),
  faktum({
    navn: "Som hovedregel må du være villig til å ta ethvert arbeid du er kvalifisert for. Dette gjelder også innenfor yrker du ikke er utdannet til eller har arbeidserfaring fra. Du må også være villig til å gå ned i lønn.",
    id: "5",
    roller: ["søker"],
    type: "boolean",
    godkjenner: [],
  }),
  faktum({
    navn: "Vedlegg...",
    id: "6",
    roller: ["søker"],
    type: "dokuemt",
    godkjenner: [],
  }),
];
