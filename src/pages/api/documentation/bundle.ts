import { withSentry } from "@sentry/nextjs";
import { v4 as uuidV4 } from "uuid";
import { NextApiRequest, NextApiResponse } from "next";
import {
  apiFetch,
  audienceDPSoknad,
  audienceMellomlagring,
  getErrorMessage,
} from "../../../api.utils";
import { getSession } from "../../../auth.utils";
import { logRequestError } from "../../../error.logger";
import { headersWithToken } from "../../../api/quiz-api";
import Metrics from "../../../metrics";

export interface IDocumentationBundleBody {
  uuid: string;
  dokumentkravId: string;
  fileUrns: { urn: string }[];
}

async function bundleHandler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req);
  if (!session) {
    return res.status(401).end();
  }

  const { uuid, dokumentkravId, fileUrns } = req.body;
  const requestIdHeader = req.headers["x-request-id"];
  const requestId = requestIdHeader === undefined ? uuidV4() : requestIdHeader;
  const DPSoknadToken = await session.apiToken(audienceDPSoknad);
  const mellomlagringToken = await session.apiToken(audienceMellomlagring);

  try {
    const bundlingTimer = Metrics.bundleTidBrukt.startTimer();
    const mellomlagringResponse = await bundleFilesMellomlagring(
      { soknadId: uuid, bundleNavn: dokumentkravId, filer: fileUrns },
      mellomlagringToken,
      requestId
    );
    bundlingTimer();

    if (!mellomlagringResponse.ok) {
      logRequestError(
        mellomlagringResponse.statusText,
        uuid,
        "Bundle dokumentkrav - Could not bundle files in dp-mellomlagring"
      );
      Metrics.bundleFeil.inc();
      return res.status(mellomlagringResponse.status).send(mellomlagringResponse.statusText);
    }

    const { urn, storrelse } = await mellomlagringResponse.json();
    Metrics.bundleStørrelse.observe(storrelse);
    if (!isNaN(fileUrns.length)) Metrics.bundleAntallFiler.observe(fileUrns.length);

    const dpSoknadResponse = await sendBundleTilDpSoknad(
      uuid,
      dokumentkravId,
      urn,
      DPSoknadToken,
      requestId
    );

    if (!dpSoknadResponse.ok) {
      logRequestError(
        dpSoknadResponse.statusText,
        uuid,
        "Bundle dokumentkrav - Could not save bundle info to dp-soknad"
      );
      return res.status(dpSoknadResponse.status).send(dpSoknadResponse.statusText);
    }

    return res.status(dpSoknadResponse.status).end();
  } catch (error) {
    const message = getErrorMessage(error);
    logRequestError(message, uuid, "Bundle dokumentkrav - Generic error");
    return res.status(500).send(message);
  }
}

async function sendBundleTilDpSoknad(
  uuid: string,
  dokumentkravId: string,
  urn: string,
  DPSoknadToken: string,
  requestId?: string
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

interface IMellomlagringBundle {
  soknadId: string;
  bundleNavn: string;
  filer: { urn: string }[];
}

async function bundleFilesMellomlagring(
  body: IMellomlagringBundle,
  mellomlagringToken: string,
  requestId?: string
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
