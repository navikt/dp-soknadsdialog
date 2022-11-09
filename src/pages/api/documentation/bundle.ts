import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { withSentry } from "@sentry/nextjs";
import { apiFetch, audienceDPSoknad, audienceMellomlagring } from "../../../api.utils";
import { getSession } from "../../../auth.utils";
import { headersWithToken } from "../quiz-api";

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

  const requestIdHeader = req.headers["x-request-id"];
  const requestId = requestIdHeader === undefined ? crypto.randomUUID() : requestIdHeader;

  const session = await getSession(req);
  if (!session) {
    return res.status(401).end();
  }

  const { uuid, dokumentkravId, fileUrns } = req.body;
  const DPSoknadToken = await session.apiToken(audienceDPSoknad);
  const mellomlagringToken = await session.apiToken(audienceMellomlagring);

  try {
    const mellomlagringResponse = await bundleFilesMellomlagring(
      { soknadId: uuid, bundleNavn: dokumentkravId, filer: fileUrns },
      mellomlagringToken,
      requestId
    );
    if (!mellomlagringResponse.ok) {
      throw new Error("Feil ved bundling i dp-mellomlagring");
    }

    // eslint-disable-next-line no-console
    console.log(`bundlet ${dokumentkravId}`);
    const { urn } = await mellomlagringResponse.json();
    const dpSoknadResponse = await sendBundleTilDpSoknad(
      uuid,
      dokumentkravId,
      urn,
      DPSoknadToken,
      requestId
    );

    if (!dpSoknadResponse.ok) {
      throw new Error("Feil ved lagring av bundle i dp-soknad");
    }
    // eslint-disable-next-line no-console
    console.log(`lagret bundle til ${dokumentkravId}`);

    return res.status(dpSoknadResponse.status).end();
  } catch (error) {
    // TODO SENTRY LOG
    // eslint-disable-next-line no-console
    console.error("CATCH ERROR bundleDokumentkrav(): ", error);
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
