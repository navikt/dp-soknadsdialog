import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../../utils/auth.utils";

async function tokenHandler(req: NextApiRequest, res: NextApiResponse<string>) {
  const session = await getSession(req);
  const isDev = process.env.NAIS_CLUSTER_NAME?.startsWith("dev-");
  if (!session || !isDev) return res.status(401).end();
  res.status(200).send(session.token);
}

export default tokenHandler;
