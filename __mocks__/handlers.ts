import { rest } from "msw";
import { v4 as uuidv4 } from "uuid";

interface Faktum {
  navn?: any;
  id?: any;
  clazz?: any;
};

const baseFaktum = { navn: "Antall uker", id: "seksjon-nan", clazz: "int" }
const faktum = ({ navn, id, clazz }: Faktum = baseFaktum) =>
  ({ navn, id, avhengigFakta: [], clazz, roller: ["søker"] });

let seksjon = 0;
if (typeof beforeEach !== "undefined") {
  beforeEach(() => (seksjon = 0));
}

const søknader = new Map();
const getFaktaFor = (søknad, seksjon) => {
  const key = `${søknad}-${seksjon}`;

  if (!søknader.has(key)) {
    søknader.set(key, lagSeksjon(seksjon));
  }

  return søknader.get(key);
};
const lagSeksjon = (seksjon) => [
  faktum({
    navn: "Ønsker dagpenger fra dato med id 2",
    id: `${seksjon}-2`,
    clazz: "localdate",
  }),
  faktum({
    navn: "Fødselsdato med id 1",
    id: `${seksjon}-1`,
    clazz: "localdate",
  }),
  faktum({
    navn: "Antall uker",
    id: `${seksjon}-3`,
    clazz: "int",
  }),
];

export const handlers = [
  rest.post(
    `${process.env.NEXT_PUBLIC_API_URL}/soknad`,
    (req, res, ctx) => {
      return res(ctx.status(201), ctx.json({ søknad_uuid: uuidv4() }));
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_API_URL}/soknad/tom-seksjon/neste-seksjon`,
    (req, res, ctx) => {
      return res(ctx.status(205));
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_API_URL}/soknad/kort-seksjon/neste-seksjon`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          fakta: [faktum({ id: `${seksjon++}-123` })],
          root: { rolle: "søker", fakta: [123] },
        })
      );
    }
  ),
  rest.put(
    `${process.env.NEXT_PUBLIC_API_URL}/soknad/kort-seksjon/faktum/:faktumId`,
    (req, res, ctx) => {
      const { faktumId } = req.params;
      const { verdi: svar } = JSON.parse(req.body as string);

      return res(
        ctx.json({
          fakta: [
            {
              ...faktum({ id: faktumId }),
              svar,
            },
          ],
          root: { rolle: "søker", fakta: [faktumId] },
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_API_URL}/soknad/:soknadId/neste-seksjon`,
    (req, res, ctx) => {
      const { soknadId } = req.params;
      if (seksjon >= 2) {
        seksjon = 0;
        return res(ctx.status(205));
      }
      const fakta = getFaktaFor(soknadId, ++seksjon);

      return res(
        ctx.json({
          fakta,
          root: { rolle: "søker", fakta: fakta.map((faktum) => faktum.id) },
        })
      );
    }
  ),
  rest.put(
    `${process.env.NEXT_PUBLIC_API_URL}/soknad/:soknadId/faktum/:faktumId`,
    (req, res, ctx) => {
      const { soknadId } = req.params;
      const { faktumId } = req.params;
      const { verdi } = JSON.parse(req.body as string);
      const fakta = getFaktaFor(soknadId, seksjon);

      fakta.find((faktum) => faktum.id == faktumId).svar = verdi;

      return res(
        ctx.json({
          fakta,
          root: { rolle: "søker", fakta: fakta.map((faktum) => faktum.id) },
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_API_URL}/soknad/:soknadId/subsumsjoner`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          fakta: [
            {
              navn: "Har opphold i Norge",
              id: 6,
              avhengigFakta: [],
              roller: ["søker"],
              svar: true,
            },
            {
              navn: "Inntekt siste 3 år",
              id: 8,
              avhengigFakta: [],
              roller: ["søker"],
              svar: 1000,
            },
            {
              navn: "3G",
              id: 11,
              avhengigFakta: [],
              roller: ["søker"],
              svar: false,
            },
            {
              navn: "Inntekt siste 12 mnd",
              id: 9,
              avhengigFakta: [],
              roller: ["søker"],
            },
            {
              navn: "1,5G",
              id: 12,
              avhengigFakta: [],
              roller: ["søker"],
            },
            {
              navn: "Dimisjonsdato",
              id: 10,
              avhengigFakta: [],
              roller: ["søker"],
            },
            {
              navn: "Virkningstidspunkt",
              id: 4,
              avhengigFakta: [],
              roller: ["søker"],
            },
            {
              navn: "Dato for bortfall på grunn av alder",
              id: 3,
              avhengigFakta: [],
              roller: ["søker"],
            },
            {
              navn: "Ønsker dagpenger fra dato",
              id: 2,
              avhengigFakta: [],
              roller: ["søker"],
              svar: "2000-01-01",
            },
            {
              navn: "Er utestengt",
              id: 5,
              avhengigFakta: [],
              roller: ["søker"],
            },
          ],
          subsumsjoner: [{
            navn: "Inngangsvilkår",
            lokalt_resultat: null,
            type: "alle",
            subsumsjoner: [
              {
                navn: "Sjekk at `Har opphold i Norge` er sann",
                type: "har",
                fakta: [6],
                lokalt_resultat: null,
              },
              {
                navn: "tapt arbeidsinntekt",
                type: "alle",
                subsumsjoner: [],
                lokalt_resultat: true,
              },
              {
                navn: "tapt arbeidstid",
                type: "alle",
                subsumsjoner: [],
                lokalt_resultat: false,
              },
              {
                navn: "minste arbeidsinntekt",
                type: "minstEnAv",
                subsumsjoner: [
                  {
                    navn: "Sjekk at 'Inntekt siste 3 år' er minst '3G'",
                    type: "minst",
                    fakta: [8, 11],
                  },
                  {
                    navn: "Sjekk at 'Inntekt siste 12 mnd' er minst '1,5G'",
                    type: "minst",
                    fakta: [9, 12],
                  },
                  {
                    navn:
                      "Sjekk at 'Dimisjonsdato' er etter 'Virkningstidspunkt'",
                    kclass: "EnkelSubsumsjon",
                    type: "etter",
                    fakta: [10, 4],
                  },
                ],
              },
              {
                navn: "reell arbeidssøker",
                type: "alle",
                subsumsjoner: [],
              },
              {
                navn: "alder",
                type: "alle",
                subsumsjoner: [
                  {
                    navn:
                      "Sjekk at 'Virkningstidspunkt' er før 'Dato for bortfall på grunn av alder'",
                    type: "før",
                    fakta: [4, 3],
                  },
                  {
                    navn:
                      "Sjekk at 'Ønsker dagpenger fra dato' er før 'Dato for bortfall på grunn av alder'",
                    type: "før",
                    fakta: [2, 3],
                  },
                ],
              },
              {
                navn: "Sjekk at `Er utestengt` ikke er sann",
                type: "erIkke",
                fakta: [5],
              },
            ],
          }],
        })
      );
    }
  ),
];
