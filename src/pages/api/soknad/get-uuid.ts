import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
import { audienceDPSoknad } from "../../../api.utils";
import { startSoknad, Prosesstype } from "../quiz-api";
import { withSentry } from "@sentry/nextjs";

async function getUuidHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).send("localhost-uuid");
  }

  const { token, apiToken } = await getSession({ req });
  const prosesstype = req.query.type as Prosesstype;

  if (!token || !apiToken) {
    return res.status(401).end();
  }

  const onBehalfOfToken = await apiToken(audienceDPSoknad);
  try {
    const soknadResponse = await startSoknad(onBehalfOfToken, prosesstype);
    if (!soknadResponse.ok) {
      throw new Error(soknadResponse.statusText);
    }

    const soknadId = await soknadResponse.text();
    return res.status(soknadResponse.status).send(soknadId);
  } catch (error) {
    return res.status(500).send(error);
  }
}

export default withSentry(getUuidHandler);
