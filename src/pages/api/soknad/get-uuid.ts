import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
import { audience } from "../../../api.utils";
import { postSoknad, Prosesstype } from "./quiz-api";
import { withSentry } from "@sentry/nextjs";

async function getUuiddHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).send("localhost-uuid");
  }

  const { token, apiToken } = await getSession({ req });
  const prosesstype = req.query.type as Prosesstype;
  let soknadId;

  if (token && apiToken) {
    const onBehalfOfToken = await apiToken(audience);
    soknadId = await postSoknad(onBehalfOfToken, prosesstype);
    return res.status(200).send(soknadId);
  } else {
    return res.status(401).send({});
  }
}

export default withSentry(getUuiddHandler);
