import { NextApiRequest, NextApiResponse } from "next";
import {
  getSoknadOnBehalfOfToken,
  getSoknadOrkestratorOnBehalfOfToken,
} from "../../../utils/auth.utils";
import { logRequestError } from "../../../error.logger";
import { getErrorMessage } from "../../../utils/api.utils";
import { createSoknadWithUuid } from "../common/quiz-api";
import { startOrkestratorSoknad } from "../orkestrator/start";

async function createSoknadOrkestratorHandler(req: NextApiRequest, res: NextApiResponse) {
  const soknadOrkestratorOnBehalfOf = await getSoknadOrkestratorOnBehalfOfToken(req);
  const soknadOnBehalfOf = await getSoknadOnBehalfOfToken(req);
  if (!soknadOrkestratorOnBehalfOf.ok || !soknadOnBehalfOf.ok) {
    return res.status(401).end();
  }

  try {
    const soknadOrkestratorResponse = await startOrkestratorSoknad(
      soknadOrkestratorOnBehalfOf.token,
    );

    if (!soknadOrkestratorResponse.ok) {
      return res
        .status(soknadOrkestratorResponse.status)
        .send(soknadOrkestratorResponse.statusText);
    }

    const soknadOrkestratorUuid = await soknadOrkestratorResponse.json();
    const soknadResponse = await createSoknadWithUuid(
      soknadOnBehalfOf.token,
      soknadOrkestratorUuid,
    );

    if (!soknadResponse.ok) {
      return res.json({ error: true });
    }

    return res.json(soknadOrkestratorUuid);
  } catch (error) {
    const message = getErrorMessage(error);
    logRequestError(message, undefined, "Get new uuid - Generic error");
    return res.status(500).send(message);
  }
}

export default createSoknadOrkestratorHandler;
