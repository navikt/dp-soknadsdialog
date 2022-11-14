import { NextApiRequest, NextApiResponse } from "next";
import { audienceDPSoknad } from "../../../api.utils";
import { createSoknadUuid } from "../quiz-api";
import { withSentry } from "@sentry/nextjs";
import { getSession } from "../../../auth.utils";
import { CREATE_INNSENDING_UUID_ERROR } from "../../../sentry-constants";
import { logFetchError } from "../../../sentry.logger";

async function getUuidHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).send("localhost-uuid");
  }

  const session = await getSession(req);

  if (!session) {
    return res.status(401).end();
  }

  const onBehalfOfToken = await session.apiToken(audienceDPSoknad);
  try {
    const soknadUuidResponse = await createSoknadUuid(onBehalfOfToken);
    if (!soknadUuidResponse.ok) {
      throw new Error(soknadUuidResponse.statusText);
    }

    const soknadId = await soknadUuidResponse.text();
    return res.status(soknadUuidResponse.status).send(soknadId);
  } catch (error) {
    logFetchError(CREATE_INNSENDING_UUID_ERROR);
    return res.status(500).send(error);
  }
}

export default withSentry(getUuidHandler);
