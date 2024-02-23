import type { NextApiRequest, NextApiResponse } from "next";
import { getToken, validateToken } from "@navikt/oasis";

async function tokenHandler(req: NextApiRequest, res: NextApiResponse<string>) {
  const token = getToken(req);
  if (!token) return res.status(401).end();
  const validation = await validateToken(token);
  const isDev = process.env.NAIS_CLUSTER_NAME?.startsWith("dev-");
  if (!validation.ok || !isDev) return res.status(401).end();
  res.status(200).send(token);
}

export default tokenHandler;
