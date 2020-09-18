import { rest } from "msw";

export const handlers = [
  rest.get(
    `${process.env.NEXT_PUBLIC_API_URL}/neste-fakta`,
    (req, res, ctx) => {
      return res(
        ctx.json([
          {
            id: 1,
            navn: "Ønsket dato",
          },
          {
            id: 2,
            navn: "Fødselsdato",
          },
        ])
      );
    }
  ),
  rest.put(
    `${process.env.NEXT_PUBLIC_API_URL}/faktum/:faktumId`,
    (req, res, ctx) => {
      const { faktumId } = req.params;
      const { svar } = req.body;
      return res(
        ctx.json([
          {
            id: faktumId,
            navn: "Ønsket dato",
            svar,
          },
        ])
      );
    }
  ),
];
