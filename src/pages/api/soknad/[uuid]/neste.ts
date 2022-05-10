import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
import { audience } from "../../../../api.utils";
import { getSoknadState } from "../../../../server-side/quiz-api";

async function nesteHandler(req: NextApiRequest, res: NextApiResponse) {
  const { token, apiToken } = await getSession({ req });
  const uuid = req.query.uuid as string;

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    const soknadState = await getSoknadState(uuid, "");
    return res.status(200).json(soknadState);
  }

  if (token && apiToken) {
    const onBehalfOfToken = await apiToken(audience);
    const soknadState = await getSoknadState(uuid, onBehalfOfToken);
    return res.status(200).json(soknadState);
  }

  res.status(404).end();
}
export default nesteHandler;
