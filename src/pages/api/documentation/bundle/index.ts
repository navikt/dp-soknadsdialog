import { withSentry } from "@sentry/nextjs";
import { v4 as uuidV4 } from "uuid";
import { NextApiRequest, NextApiResponse } from "next";
import {
  apiFetch,
  audienceDPSoknad,
  audienceMellomlagring,
  getErrorMessage,
} from "../../../../api.utils";
import { getSession } from "../../../../auth.utils";
import { logRequestError } from "../../../../sentry.logger";
import { headersWithToken } from "../../../../api/quiz-api";

export interface IDocumentationBundleBody {
  uuid: string;
  dokumentkravId: string;
  fileUrns: { urn: string }[];
}

async function bundleHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    if (req.body.dokumentkravId === "7002") {
      return res.status(400).json({ status: "failed" });
    }

    return res.status(200).json({ status: "ok" });
  }

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
    const mellomlagringResponse = await bundleFilesMellomlagring(
      { soknadId: uuid, bundleNavn: dokumentkravId, filer: fileUrns },
      mellomlagringToken,
      requestId
    );
    if (!mellomlagringResponse.ok) {
      logRequestError(mellomlagringResponse.statusText);
      return res.status(mellomlagringResponse.status).send(mellomlagringResponse.statusText);
    }

    const { urn } = await mellomlagringResponse.json();
    const dpSoknadResponse = await sendBundleTilDpSoknad(
      uuid,
      dokumentkravId,
      urn,
      DPSoknadToken,
      requestId
    );

    if (!dpSoknadResponse.ok) {
      logRequestError(dpSoknadResponse.statusText);
      return res.status(dpSoknadResponse.status).send(dpSoknadResponse.statusText);
    }

    return res.status(dpSoknadResponse.status).end();
  } catch (error) {
    const message = getErrorMessage(error);
    logRequestError(message);
    return res.status(500).send(message);
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

interface IMellomlagringBundle {
  soknadId: string;
  bundleNavn: string;
  filer: { urn: string }[];
}

async function bundleFilesMellomlagring(
  body: IMellomlagringBundle,
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