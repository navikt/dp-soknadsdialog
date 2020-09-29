import { rest } from "msw";

const faktum = (
  { navn, id, type } = { navn: "Antall uker", id: 1, type: "int" }
) => ({ navn, id, avhengigFakta: [], clazz: type, roller: ["søker"] });

const søknader = new Map();
const getFaktaFor = (søknad) => {
  if (!søknader.has(søknad)) {
    søknader.set(søknad, [
      faktum({
        navn: "Ønsker dagpenger fra dato med id 2",
        id: 2,
        clazz: "localdate",
      }),
      faktum({ navn: "Fødselsdato med id 1", id: 1, clazz: "localdate" }),
      faktum({ navn: "Antall uker", id: 3, clazz: "int" }),
    ]);
  }

  return søknader.get(søknad);
};
export const handlers = [
  rest.get(
    `${process.env.NEXT_PUBLIC_API_URL}/soknad/kort-seksjon/neste-seksjon`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          fakta: [faktum({ id: 123 })],
          root: { rolle: "søker", fakta: [123] },
        })
      );
    }
  ),
  rest.put(
    `${process.env.NEXT_PUBLIC_API_URL}/soknad/kort-seksjon/faktum/:faktumId`,
    (req, res, ctx) => {
      const { verdi } = JSON.parse(req.body);

      return res(
        ctx.json({
          fakta: [
            {
              ...faktum({ id: 123 }),
              verdi,
            },
          ],
          root: { rolle: "søker", fakta: [123] },
        })
      );
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_API_URL}/soknad/:soknadId/neste-seksjon`,
    (req, res, ctx) => {
      const { soknadId } = req.params;
      const fakta = getFaktaFor(soknadId);

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
      const { verdi } = JSON.parse(req.body);
      const fakta = getFaktaFor(soknadId);

      fakta.find((faktum) => faktum.id == faktumId).verdi = verdi;

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
            },
            {
              navn: "Inntekt siste 3 år",
              id: 8,
              avhengigFakta: [],
              roller: ["søker"],
            },
            {
              navn: "3G",
              id: 11,
              avhengigFakta: [],
              roller: ["søker"],
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
          root: {
            navn: "Inngangsvilkår",
            kclass: "AlleSubsumsjon",
            regelType: "alle",
            subsumsjoner: [
              {
                navn: "Sjekk at `Har opphold i Norge` er sann",
                kclass: "EnkelSubsumsjon",
                regelType: "har",
                fakta: [6],
              },
              {
                navn: "tapt arbeidsinntekt",
                kclass: "AlleSubsumsjon",
                regelType: "alle",
                subsumsjoner: [],
              },
              {
                navn: "tapt arbeidstid",
                kclass: "AlleSubsumsjon",
                regelType: "alle",
                subsumsjoner: [],
              },
              {
                navn: "minste arbeidsinntekt",
                kclass: "MinstEnAvSubsumsjon",
                regelType: "minstEnAv",
                subsumsjoner: [
                  {
                    navn: "Sjekk at 'Inntekt siste 3 år' er minst '3G'",
                    kclass: "EnkelSubsumsjon",
                    regelType: "minst",
                    fakta: [8, 11],
                  },
                  {
                    navn: "Sjekk at 'Inntekt siste 12 mnd' er minst '1,5G'",
                    kclass: "EnkelSubsumsjon",
                    regelType: "minst",
                    fakta: [9, 12],
                  },
                  {
                    navn:
                      "Sjekk at 'Dimisjonsdato' er etter 'Virkningstidspunkt'",
                    kclass: "EnkelSubsumsjon",
                    regelType: "etter",
                    fakta: [10, 4],
                  },
                ],
              },
              {
                navn: "reell arbeidssøker",
                kclass: "AlleSubsumsjon",
                regelType: "alle",
                subsumsjoner: [],
              },
              {
                navn: "alder",
                kclass: "AlleSubsumsjon",
                regelType: "alle",
                subsumsjoner: [
                  {
                    navn:
                      "Sjekk at 'Virkningstidspunkt' er før 'Dato for bortfall på grunn av alder'",
                    kclass: "EnkelSubsumsjon",
                    regelType: "før",
                    fakta: [4, 3],
                  },
                  {
                    navn:
                      "Sjekk at 'Ønsker dagpenger fra dato' er før 'Dato for bortfall på grunn av alder'",
                    kclass: "EnkelSubsumsjon",
                    regelType: "før",
                    fakta: [2, 3],
                  },
                ],
              },
              {
                navn: "Sjekk at `Er utestengt` ikke er sann",
                kclass: "EnkelSubsumsjon",
                regelType: "erIkke",
                fakta: [5],
              },
            ],
          },
        })
      );
    }
  ),
];
