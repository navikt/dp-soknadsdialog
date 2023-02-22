import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { audienceDPSoknad, getErrorMessage } from "../../../api.utils";
import { headersWithToken } from "../../../api/quiz-api";
import { getSession } from "../../../auth.utils";
import { logRequestError } from "../../../sentry.logger";

export interface IDeleteSoknadBody {
  uuid: string;
}

async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).json("slettet");
  }

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
      logRequestError(deleteSoknadResponse.statusText, uuid);
      return res.status(deleteSoknadResponse.status).send(deleteSoknadResponse.statusText);
    }

    return res.status(deleteSoknadResponse.status).send(deleteSoknadResponse.statusText);
  } catch (error) {
    const message = getErrorMessage(error);
    logRequestError(message, uuid);
    return res.status(500).send(message);
  }
}

export default withSentry(deleteHandler);
