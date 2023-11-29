import { NextApiRequest, NextApiResponse } from "next";
import { getErrorMessage } from "../../../utils/api.utils";
import { headersWithToken } from "../../../api/quiz-api";
import { getSession, getSoknadOnBehalfOfToken } from "../../../utils/auth.utils";
import { logRequestError } from "../../../error.logger";

export interface IDeleteSoknadBody {
  uuid: string;
}

async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.USE_MOCKS === "true") {
    return res.status(200).json("slettet");
  }

  const session = await getSession(req);
  if (!session) {
    return res.status(401).end();
  }

  const { uuid } = req.body;
  try {
    const onBehalfOfToken = await getSoknadOnBehalfOfToken(session);
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

export default deleteHandler;
