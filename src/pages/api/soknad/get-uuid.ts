import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
import { audience } from "../../../api.utils";
import { postSoknad } from "../../../server-side/quiz-api";

async function getUuiddHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).send("localhost-uuid");
  }

  const { token, apiToken } = await getSession({ req });
  let soknadId;
  if (token && apiToken) {
    const onBehalfOfToken = await apiToken(audience);
    soknadId = await postSoknad(onBehalfOfToken);
    return res.status(200).send(soknadId);
  } else {
    return res.status(401).send({});
  }
}

export default getUuiddHandler;
