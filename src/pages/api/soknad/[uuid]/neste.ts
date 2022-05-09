import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
import { audience } from "../../../../api.utils";
import { getFakta } from "../../../../server-side/quiz-api";

async function nesteHandler(req: NextApiRequest, res: NextApiResponse) {
  const { token, apiToken } = await getSession({ req });
  const uuid = req.query.uuid as string;

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    const fakta = await getFakta(uuid, "");
    return res.status(200).json(fakta);
  }

  if (token && apiToken) {
    const onBehalfOfToken = await apiToken(audience);
    const fakta = await getFakta(uuid, onBehalfOfToken);
    return res.status(200).json(fakta);
  }

  res.status(404).end();
}
export default nesteHandler;
