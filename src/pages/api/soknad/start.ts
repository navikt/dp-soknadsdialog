import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
import { audience } from "../../../api.utils";
import { postSoknad } from "../../../server-side/quiz-api";

async function startSoknadHandler(req: NextApiRequest, res: NextApiResponse) {
  const { token, apiToken } = await getSession({ req });
  let soknadId;
  if (token && apiToken) {
    const onBehalfOfToken = await apiToken(audience);
    soknadId = await postSoknad(onBehalfOfToken);
    return res.status(200).json(soknadId);
  } else {
    return res.status(401).send({});
  }
}

export default startSoknadHandler;
