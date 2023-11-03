import { NextApiRequest, NextApiResponse } from "next";
import { getErrorMessage } from "../../../../api.utils";
import { headersWithToken } from "../../../../api/quiz-api";
import {
  getMellomlagringOnBehalfOfToken,
  getSession,
  getSoknadOnBehalfOfToken,
} from "../../../../auth.utils";
import { logRequestError } from "../../../../error.logger";

export interface IDeleteFileBody {
  uuid: string;
  dokumentkravId: string;
  filsti: string;
}

async function deleteFileHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.USE_MOCKS) {
    return res.status(200).json("slettet");
  }

  const session = await getSession(req);
  if (!session) {
    return res.status(401).end();
  }

  const { uuid, dokumentkravId, filsti } = req.body;
  const DPSoknadToken = await getSoknadOnBehalfOfToken(session);
  const mellomlagringToken = await getMellomlagringOnBehalfOfToken(session);

  try {
    const dpSoknadResponse = await deleteFileFromDPSoknad(
      uuid,
      dokumentkravId,
      DPSoknadToken,
      filsti
    );

    if (!dpSoknadResponse.ok) {
      logRequestError(
        dpSoknadResponse.statusText,
        uuid,
        "Dokumentkrav delete file - Delete from dp-soknad failed"
      );
      return res.status(dpSoknadResponse.status).send(dpSoknadResponse.statusText);
    }

    const mellomlagringResponse = await deleteFileFromMellomlagring(
      uuid,
      mellomlagringToken,
      filsti
    );

    if (!mellomlagringResponse.ok) {
      logRequestError(
        mellomlagringResponse.statusText,
        uuid,
        "Dokumentkrav delete file - Delete from dp-mellomlagring failed"
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
  soknadOboToken: string,
  filsti: string
) {
  const url = `${process.env.API_BASE_URL}/soknad/${uuid}/dokumentasjonskrav/${dokumentkravId}/fil/${filsti}`;
  return fetch(url, {
    method: "DELETE",
    headers: headersWithToken(soknadOboToken),
  });
}

async function deleteFileFromMellomlagring(
  uuid: string,
  mellomlagringToken: string,
  filsti: string
) {
  const url = `${process.env.MELLOMLAGRING_BASE_URL}/vedlegg/${filsti}`;
  return fetch(url, {
    method: "DELETE",
    headers: headersWithToken(mellomlagringToken),
  });
}

export default deleteFileHandler;
