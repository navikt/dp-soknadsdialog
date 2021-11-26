import { rest } from "msw";
import { v4 as uuidv4 } from "uuid";
import { api } from "../src/services/api";

import { getFaktaFor } from "./seksjonMock";

let seksjon = 0;
if (typeof beforeEach !== "undefined") {
  beforeEach(() => (seksjon = 0));
}

export const handlers = [
  rest.get(api("/auth/session"), (req, res, ctx) => {
    return res(ctx.json({ expires_in: 123 }));
  }),
  rest.post(
    `${process.env.NEXT_PUBLIC_BASE_PATH}/api/soknad`,
    (req, res, ctx) => {
      return res(ctx.status(201), ctx.json({ søknad_uuid: uuidv4() }));
    }
  ),
  rest.get(
    `${process.env.NEXT_PUBLIC_BASE_PATH}/api/soknad/:soknadId/neste-seksjon`,
    (req, res, ctx) => {
      const { soknadId } = req.params;
      if (seksjon >= 2) {
        seksjon = 0;
        return res(ctx.status(205));
      }
      const fakta = getFaktaFor(soknadId, ++seksjon);

      return res(
        ctx.json({
          seksjon_navn: "Reell arbeidssøker",
          indeks: 0,
          fakta: fakta,
        })
      );
    }
  ),
  rest.put(
    `${process.env.NEXT_PUBLIC_BASE_PATH}/api/soknad/:soknadId/faktum/:faktumId`,
    (req, res, ctx) => {
      const { soknadId } = req.params;
      const { faktumId } = req.params;
      const { verdi } = JSON.parse(req.body as string);
      const fakta = getFaktaFor(soknadId, seksjon);

      fakta.find((faktum) => faktum.id == faktumId).svar = verdi;

      return res(ctx.json({ seksjon_navn: "søker", indeks: 0, fakta: fakta }));
    }
  ),
];
