import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidV4 } from "uuid";
import { headersWithToken } from "../../../quiz-api";
import { withSentry } from "@sentry/nextjs";
import { apiFetch, audienceDPSoknad, audienceMellomlagring } from "../../../../../api.utils";
import { getSession } from "../../../../../auth.utils";
import { logRequestError } from "../../../../../sentry.logger";
import {
  BUNBLE_DOCKUMENTKRAV_ERROR,
  BUNBLE_FILES_IN_DP_MELLOMLAGRING_ERROR,
  SEND_BUNBLE_TO_DP_SOKNAD_ERROR,
} from "../../../../../sentry-constants";
import Metrics from "../../../../../metrics";

async function bundleHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).json({ status: "ok" });
  }

  const session = await getSession(req);
  if (!session) {
    return res.status(401).end();
  }

  const uuid = req.query.uuid as string;
  const dokumentkravId = req.query.dokumentkravId as string;
  const body = req.body;
  const antallFiler = Number(req.body.filer?.length);
  const DPSoknadToken = await session.apiToken(audienceDPSoknad);
  const mellomlagringToken = await session.apiToken(audienceMellomlagring);
  const requestIdHeader = req.headers["x-request-id"];
  const requestId = requestIdHeader === undefined ? uuidV4() : requestIdHeader;

  try {
    const bundlingTimer = Metrics.bundleTidBrukt.startTimer();
    const mellomlagringResponse = await bundleFilesMellomlagring(
      body,
      mellomlagringToken,
      requestId
    );
    bundlingTimer();

    if (!mellomlagringResponse.ok) {
      logRequestError(BUNBLE_FILES_IN_DP_MELLOMLAGRING_ERROR, uuid);
      Metrics.bundleFeil.inc();
      throw new Error("Feil ved bundling i dp-mellomlagring");
    }

    const { urn, storrelse } = await mellomlagringResponse.json();
    Metrics.bundleStørrelse.observe(storrelse);
    if (!isNaN(antallFiler)) Metrics.bundleAntallFiler.observe(antallFiler);

    const dpSoknadResponse = await sendBundleTilDpSoknad(
      uuid,
      dokumentkravId,
      urn,
      DPSoknadToken,
      requestId
    );

    if (!dpSoknadResponse.ok) {
      logRequestError(SEND_BUNBLE_TO_DP_SOKNAD_ERROR, uuid);
      throw new Error("Feil ved lagring av bundle i dp-soknad");
    }

    return res.status(dpSoknadResponse.status).end();
  } catch (error) {
    logRequestError(BUNBLE_DOCKUMENTKRAV_ERROR, uuid);
    return res.status(500).json(error);
  }
}

async function sendBundleTilDpSoknad(
  uuid: string,
  dokumentkravId: string,
  urn: string,
  DPSoknadToken: string,
  requestId: string
) {
  const url = `${process.env.API_BASE_URL}/soknad/${uuid}/dokumentasjonskrav/${dokumentkravId}/bundle`;
  return apiFetch(
    url,
    {
      method: "PUT",
      headers: headersWithToken(DPSoknadToken),
      body: JSON.stringify({ urn }),
    },
    requestId
  );
}

async function bundleFilesMellomlagring(
  body: BodyInit,
  mellomlagringToken: string,
  requestId: string
) {
  const url = `${process.env.MELLOMLAGRING_BASE_URL}/pdf/bundle`;
  return apiFetch(
    url,
    {
      method: "POST",
      headers: headersWithToken(mellomlagringToken),
      body: JSON.stringify(body),
    },
    requestId
  );
}

export default withSentry(bundleHandler);
