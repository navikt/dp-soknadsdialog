import { NextApiRequest, NextApiResponse } from "next";
import { audienceDPSoknad, getErrorMessage } from "../../../api.utils";
import { createSoknadUuid } from "../../../api/quiz-api";
import { getSession } from "../../../auth.utils";
import { logRequestError } from "../../../error.logger";

async function uuidHandler(req: NextApiRequest, res: NextApiResponse) {
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
      logRequestError(
        soknadUuidResponse.statusText,
        undefined,
        "Get new uuid - Failed to get new uuid from dp-soknad"
      );
      return res.status(soknadUuidResponse.status).send(soknadUuidResponse.statusText);
    }

    const soknadId = await soknadUuidResponse.text();
    return res.status(soknadUuidResponse.status).send(soknadId);
  } catch (error) {
    const message = getErrorMessage(error);
    logRequestError(message, undefined, "Get new uuid - Generic error");
    return res.status(500).send(message);
  }
}

export default uuidHandler;
