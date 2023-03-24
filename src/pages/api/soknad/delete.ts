import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { audienceDPSoknad, getErrorMessage } from "../../../api.utils";
import { headersWithToken } from "../../../api/quiz-api";
import { getSession } from "../../../auth.utils";
import { logRequestError } from "../../../error.logger";

export interface IDeleteSoknadBody {
  uuid: string;
}

async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req);
  if (!session) {
    return res.status(401).end();
  }

  const { uuid } = req.body;
  try {
    const onBehalfOfToken = await session.apiToken(audienceDPSoknad);
    const deleteSoknadResponse = await fetch(`${process.env.API_BASE_URL}/soknad/${uuid}`, {
      method: "DELETE",
      headers: headersWithToken(onBehalfOfToken),
    });

    if (!deleteSoknadResponse.ok) {
      logRequestError(
        deleteSoknadResponse.statusText,
        uuid,
        "Delete faktum - Failed to delete from dp-soknad"
      );
      return res.status(deleteSoknadResponse.status).send(deleteSoknadResponse.statusText);
    }

    return res.status(deleteSoknadResponse.status).send(deleteSoknadResponse.statusText);
  } catch (error) {
    const message = getErrorMessage(error);
    logRequestError(message, uuid, "Delete faktum - Generic error");
    return res.status(500).send(message);
  }
}

export default withSentry(deleteHandler);
