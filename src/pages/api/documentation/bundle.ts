import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidV4 } from "uuid";
import { apiFetch, getErrorMessage } from "../../../api.utils";
import { headersWithToken } from "../../../api/quiz-api";
import { getMellomlagringOboToken, getSession, getSoknadOboToken } from "../../../auth.utils";
import { logRequestError } from "../../../error.logger";
import Metrics from "../../../metrics";

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
  const soknadOboToken = await getSoknadOboToken(session);
  const mellomlagringOboToken = await getMellomlagringOboToken(session);

  try {
    const bundlingTimer = Metrics.bundleTidBrukt.startTimer();
    const mellomlagringResponse = await bundleFilesMellomlagring(
      { soknadId: uuid, bundleNavn: dokumentkravId, filer: fileUrns },
      mellomlagringOboToken,
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
      soknadOboToken,
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
  mellomlagringOboToken: string,
  requestId?: string
) {
  const url = `${process.env.MELLOMLAGRING_BASE_URL}/pdf/bundle`;
  return apiFetch(
    url,
    {
      method: "POST",
      headers: headersWithToken(mellomlagringOboToken),
      body: JSON.stringify(body),
    },
    requestId
  );
}

export default bundleHandler;
