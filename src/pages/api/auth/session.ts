import { expiresIn, getToken, validateToken } from "@navikt/oasis";
import { NextApiRequest, NextApiResponse } from "next";

export interface ISessionData {
  expiresIn: number;
}

async function session(req: NextApiRequest, res: NextApiResponse<ISessionData>) {
  if (process.env.NEXT_PUBLIC_LOCALHOST === "true" && process.env.DP_SOKNAD_TOKEN) {
    res.json({
      expiresIn: expiresIn(process.env.DP_SOKNAD_TOKEN),
    });
  }

  const token = getToken(req);
  if (!token) return res.status(401).end();

  const validation = await validateToken(token);
  if (!validation.ok) return res.status(401).end();

  res.json({
    expiresIn: expiresIn(token),
  });
}

export default session;
