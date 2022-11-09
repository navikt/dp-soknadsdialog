import { NextApiRequest, NextApiResponse } from "next";
import { headersWithToken } from "../../../quiz-api";
import { withSentry } from "@sentry/nextjs";
import { apiFetch, audienceDPSoknad, audienceMellomlagring } from "../../../../../api.utils";
import { getSession } from "../../../../../auth.utils";
import crypto from "crypto";

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
  const DPSoknadToken = await session.apiToken(audienceDPSoknad);
  const mellomlagringToken = await session.apiToken(audienceMellomlagring);
  const requestIdHeader = req.headers["x-request-id"];
  const requestId = requestIdHeader === undefined ? crypto.randomUUID() : requestIdHeader;

  try {
    const mellomlagringResponse = await bundleFilesMellomlagring(
      body,
      mellomlagringToken,
      requestId
    );

    if (!mellomlagringResponse.ok) {
      throw new Error("Feil ved bundling i dp-mellomlagring");
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
      throw new Error("Feil ved lagring av bundle i dp-soknad");
    }

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
