import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../../auth.utils";

export interface ISessionData {
  expiresIn: number;
}

async function session(req: NextApiRequest, res: NextApiResponse<ISessionData>) {
  const session = await getSession(req);

  if (!session) return res.status(401).end();

  res.json({
    expiresIn: session.expiresIn,
  });
}

export default session;
