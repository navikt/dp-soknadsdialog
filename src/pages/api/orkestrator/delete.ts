import { NextApiRequest, NextApiResponse } from "next";
import { getErrorMessage } from "../../../utils/api.utils";
import { getSoknadOrkestratorOnBehalfOfToken } from "../../../utils/auth.utils";
import { logRequestErrorAsInfo } from "../../../error.logger";
import { deleteOrkestratorSoknad } from "../common/orkestrator-api";

export interface IDeleteOrkestratorSoknadBody {
  uuid: string;
}

async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.USE_MOCKS === "true") {
    return res.status(200).json("slettet");
  }

  const { uuid } = req.body;
  try {
    const onBehalfOf = await getSoknadOrkestratorOnBehalfOfToken(req);
    if (!onBehalfOf.ok) {
      return res.status(401).end();
    }

    const deleteResponse = await deleteOrkestratorSoknad(onBehalfOf.token, uuid);

    if (!deleteResponse.ok) {
      logRequestErrorAsInfo(
        deleteResponse.statusText,
        uuid,
        "Delete orkestrator soknad - Failed to delete from dp-soknad-orkestrator",
      );
      return res.status(deleteResponse.status).send(deleteResponse.statusText);
    }

    return res.status(deleteResponse.status).send(deleteResponse.statusText);
  } catch (error) {
    const message = getErrorMessage(error);
    logRequestErrorAsInfo(message, uuid, "Delete orkestrator soknad - Generic error");
    return res.status(500).send(message);
  }
}

export default deleteHandler;
