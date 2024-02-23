import { NextApiRequest, NextApiResponse } from "next";
import { expiresIn, getToken, validateToken } from "@navikt/oasis";

export interface ISessionData {
  expiresIn: number;
}

async function session(req: NextApiRequest, res: NextApiResponse<ISessionData>) {
  const token = getToken(req);
  if (!token) return res.status(401).end();
  const validation = await validateToken(token);
  if (!validation.ok) return res.status(401).end();

  res.json({
    expiresIn: expiresIn(token),
  });
}

export default session;
