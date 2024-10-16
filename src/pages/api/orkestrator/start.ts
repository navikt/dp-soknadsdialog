import { NextApiRequest, NextApiResponse } from "next";
import { logRequestError } from "../../../error.logger";
import { getErrorMessage } from "../../../utils/api.utils";
import {
  getSoknadOnBehalfOfToken,
  getSoknadOrkestratorOnBehalfOfToken,
} from "../../../utils/auth.utils";
import { createSoknadWithUuid } from "../common/quiz-api";

export function startOrkestratorSoknad(onBehalfOfToken: string) {
  const url = `${process.env.DP_SOKNAD_ORKESTRATOR_URL}/soknad/start`;

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });
}

async function startOrkestratorSoknadHandler(req: NextApiRequest, res: NextApiResponse) {
  const orkestratorOnBehalfOf = await getSoknadOrkestratorOnBehalfOfToken(req);
  const soknadOnBehalfOf = await getSoknadOnBehalfOfToken(req);

  if (!orkestratorOnBehalfOf.ok || !soknadOnBehalfOf.ok) {
    return res.status(401).end();
  }

  try {
    const startOrkestratorSoknadResponse = await startOrkestratorSoknad(
      orkestratorOnBehalfOf.token,
    );

    if (!startOrkestratorSoknadResponse.ok) {
      return res
        .status(startOrkestratorSoknadResponse.status)
        .send(startOrkestratorSoknadResponse.statusText);
    }

    const orkestratorSoknadUuid = await startOrkestratorSoknadResponse.json();
    const soknadResponse = await createSoknadWithUuid(
      soknadOnBehalfOf.token,
      orkestratorSoknadUuid,
    );

    if (!soknadResponse.ok) {
      return res.status(soknadResponse.status).send(soknadResponse.statusText);
    }

    return res.json(orkestratorSoknadUuid);
  } catch (error) {
    const message = getErrorMessage(error);
    logRequestError(message, undefined, "Get new uuid - Generic error");
    return res.status(500).send(message);
  }
}

export default startOrkestratorSoknadHandler;
