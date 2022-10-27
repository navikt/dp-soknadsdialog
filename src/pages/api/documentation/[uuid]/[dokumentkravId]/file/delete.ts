import { NextApiRequest, NextApiResponse } from "next";
import { headersWithToken } from "../../../../quiz-api";
import { withSentry } from "@sentry/nextjs";
import { audienceDPSoknad, audienceMellomlagring } from "../../../../../../api.utils";
import { getSession } from "../../../../../../auth.utils";

async function deleteFileHandler(req: NextApiRequest, res: NextApiResponse) {
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
      throw new Error("Feil ved sletting i dp-soknad");
    }

    const mellomlagringResponse = await deleteFileFromMellomlagring(
      uuid,
      mellomlagringToken,
      req.body.filsti
    );

    if (!mellomlagringResponse.ok) {
      // TODO Should be logged to sentry, but it does not effect user so we do not throw error here
      // eslint-disable-next-line no-console
      console.error("Feil ved sletting av fil i dp-mellomlagring");
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
