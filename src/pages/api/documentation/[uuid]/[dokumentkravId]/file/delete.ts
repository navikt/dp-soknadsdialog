import { NextApiRequest, NextApiResponse } from "next";
import { headersWithToken } from "../../../../quiz-api";
import { withSentry } from "@sentry/nextjs";
import { audienceDPSoknad, audienceMellomlagring } from "../../../../../../api.utils";
import { getSession } from "../../../../../../auth.utils";
import { logFetchError } from "../../../../../../sentry.logger";
import {
  DELETE_FILE_FROM_DP_MELLOMLAGRING_ERROR,
  DELETE_FILE_FROM_DP_SOKNAD_ERROR,
} from "../../../../../../sentry-constants";

async function deleteFileHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).json("slettet");
  }

  const session = await getSession(req);

  if (!session) {
    return res.status(401).end();
  }

  const uuid = req.query.uuid as string;
  const dokumentkravId = req.query.dokumentkravId as string;
  const DPSoknadToken = await session.apiToken(audienceDPSoknad);
  const mellomlagringToken = await session.apiToken(audienceMellomlagring);

  try {
    const dpSoknadResponse = await deleteFileFromDPSoknad(
      uuid,
      dokumentkravId,
      DPSoknadToken,
      req.body.filsti
    );

    if (!dpSoknadResponse.ok) {
      logFetchError(DELETE_FILE_FROM_DP_SOKNAD_ERROR, uuid);
      throw new Error("Feil ved sletting i dp-soknad");
    }

    const mellomlagringResponse = await deleteFileFromMellomlagring(
      uuid,
      mellomlagringToken,
      req.body.filsti
    );

    if (!mellomlagringResponse.ok) {
      logFetchError(DELETE_FILE_FROM_DP_MELLOMLAGRING_ERROR, uuid);
    }

    return res.status(dpSoknadResponse.status).end();
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function deleteFileFromDPSoknad(
  uuid: string,
  dokumentkravId: string,
  DPSoknadToken: string,
  filsti: string
) {
  const url = `${process.env.API_BASE_URL}/soknad/${uuid}/dokumentasjonskrav/${dokumentkravId}/fil/${filsti}`;
  return fetch(url, {
    method: "DELETE",
    headers: headersWithToken(DPSoknadToken),
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

export default withSentry(deleteFileHandler);
