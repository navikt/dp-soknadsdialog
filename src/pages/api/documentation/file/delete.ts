import { NextApiRequest, NextApiResponse } from "next";
import { logRequestError } from "../../../../error.logger";
import { getErrorMessage } from "../../../../utils/api.utils";
import {
  getMellomlagringOnBehalfOfToken,
  getSoknadOnBehalfOfToken,
} from "../../../../utils/auth.utils";
import { validateUUID } from "../../../../utils/uuid.utils";
import { headersWithToken } from "../../common/quiz-api";

export interface IDeleteFileBody {
  uuid: string;
  dokumentkravId: string;
  filsti: string;
}

async function deleteFileHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.USE_MOCKS === "true") {
    return res.status(200).json("slettet");
  }

  const { uuid, dokumentkravId, filsti } = req.body;
  validateUUID(uuid);

  const soknadOnBehalfOf = await getSoknadOnBehalfOfToken(req);
  const mellomlagringOnBehalfOf = await getMellomlagringOnBehalfOfToken(req);
  if (!soknadOnBehalfOf.ok || !mellomlagringOnBehalfOf.ok) {
    return res.status(401).end();
  }

  try {
    const dpSoknadResponse = await deleteFileFromDPSoknad(
      uuid,
      dokumentkravId,
      soknadOnBehalfOf.token,
      filsti,
    );

    if (!dpSoknadResponse.ok) {
      logRequestError(
        dpSoknadResponse.statusText,
        uuid,
        "Dokumentkrav delete file - Delete from dp-soknad failed",
      );
      return res.status(dpSoknadResponse.status).send(dpSoknadResponse.statusText);
    }

    const mellomlagringResponse = await deleteFileFromMellomlagring(
      uuid,
      mellomlagringOnBehalfOf.token,
      filsti,
    );

    if (!mellomlagringResponse.ok) {
      logRequestError(
        mellomlagringResponse.statusText,
        uuid,
        "Dokumentkrav delete file - Delete from dp-mellomlagring failed",
      );
    }

    return res.status(dpSoknadResponse.status).send(dpSoknadResponse.statusText);
  } catch (error) {
    const message = getErrorMessage(error);
    logRequestError(message, uuid, "Dokumentkrav delete file - Generic error");
    return res.status(500).send(message);
  }
}

async function deleteFileFromDPSoknad(
  uuid: string,
  dokumentkravId: string,
  onBehalfOfToken: string,
  filsti: string,
) {
  validateUUID(uuid);

  const url = `${process.env.API_BASE_URL}/soknad/${uuid}/dokumentasjonskrav/${dokumentkravId}/fil/${filsti}`;
  return fetch(url, {
    method: "DELETE",
    headers: headersWithToken(onBehalfOfToken),
  });
}

async function deleteFileFromMellomlagring(
  uuid: string,
  mellomlagringToken: string,
  filsti: string,
) {
  const url = `${process.env.MELLOMLAGRING_BASE_URL}/vedlegg/${filsti}`;
  return fetch(url, {
    method: "DELETE",
    headers: headersWithToken(mellomlagringToken),
  });
}

export default deleteFileHandler;
