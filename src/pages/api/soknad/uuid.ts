import { NextApiRequest, NextApiResponse } from "next";
import { getErrorMessage } from "../../../utils/api.utils";
import { getSoknadOnBehalfOfToken } from "../../../utils/auth.utils";
import { logRequestErrorAsInfo } from "../../../error.logger";
import { createSoknadUuid } from "../common/quiz-api";

async function uuidHandler(req: NextApiRequest, res: NextApiResponse) {
  const onBehalfOf = await getSoknadOnBehalfOfToken(req);
  if (!onBehalfOf.ok) {
    return res.status(401).end();
  }

  try {
    const soknadUuidResponse = await createSoknadUuid(onBehalfOf.token);

    if (!soknadUuidResponse.ok) {
      logRequestErrorAsInfo(
        soknadUuidResponse.statusText,
        undefined,
        "Get new uuid - Failed to get new uuid from dp-soknad",
      );
      return res.status(soknadUuidResponse.status).send(soknadUuidResponse.statusText);
    }

    const soknadId = await soknadUuidResponse.text();
    return res.status(soknadUuidResponse.status).send(soknadId);
  } catch (error) {
    const message = getErrorMessage(error);
    logRequestErrorAsInfo(message, undefined, "Get new uuid - Generic error");
    return res.status(500).send("Internal server error");
  }
}

export default uuidHandler;
