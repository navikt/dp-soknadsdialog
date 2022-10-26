import { NextApiRequest, NextApiResponse } from "next";
import { audienceDPSoknad } from "../../../api.utils";
import { createSoknadUuid } from "../quiz-api";
import { withSentry } from "@sentry/nextjs";
import { getSession } from "../../../auth.utils";

async function getUuidHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).send("localhost-uuid");
  }

  const { token, apiToken } = await getSession(req);

  if (!token || !apiToken) {
    return res.status(401).end();
  }

  const onBehalfOfToken = await apiToken(audienceDPSoknad);
  try {
    const soknadUuidResponse = await createSoknadUuid(onBehalfOfToken);
    if (!soknadUuidResponse.ok) {
      throw new Error(soknadUuidResponse.statusText);
    }

    const soknadId = await soknadUuidResponse.text();
    return res.status(soknadUuidResponse.status).send(soknadId);
  } catch (error) {
    return res.status(500).send(error);
  }
}

export default withSentry(getUuidHandler);
