import { Faktum } from "../src/models/quiz";

const baseFaktum = { navn: "Antall uker", id: "seksjon-nan", type: "int" };
const faktum = ({ navn, id, type }: Faktum = baseFaktum) => ({
  navn,
  id,
  type,
  roller: ["søker"],
});

const erUbesvart = (faktum) => faktum.svar === undefined;
const søknader = new Map();
export const getFaktaFor = (søknad, seksjon) => {
  const key = `${søknad}-${seksjon}`;

  if (!søknader.has(key)) {
    søknader.set(key, seksjon1(seksjon));
  }
  return søknader.get(key);
};

const seksjon1 = (seksjon) => [
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
    navn: "Bekreftelse fra relevant fagpersonell",
    id: "8",
    roller: ["søker"],
    type: "dokument",
    godkjenner: [],
  }),
  faktum({
    navn: "Redusert helse, fysisk eller psykisk",
    id: "7",
    roller: ["søker"],
    type: "boolean",
    godkjenner: ["8"],
  }),
];
