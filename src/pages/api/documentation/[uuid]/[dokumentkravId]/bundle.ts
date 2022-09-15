import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@navikt/dp-auth/server";
import { headersWithToken } from "../../../quiz-api";
import { withSentry } from "@sentry/nextjs";
import { audienceDPSoknad, audienceMellomlagring } from "../../../../../api.utils";

async function bundleHandler(req: NextApiRequest, res: NextApiResponse) {
  const { token, apiToken } = await getSession({ req });

  if (!token || !apiToken) {
    return res.status(401).end();
  }

  const uuid = req.query.uuid as string;
  const dokumentkravId = req.query.doku as string;
  const body = req.body;
  const DPSoknadToken = await apiToken(audienceDPSoknad);
  const mellomlagringToken = await apiToken(audienceMellomlagring);

  try {
    const mellomlagringResponse = await bundleFilesMellomlagring(body, mellomlagringToken);

    if (!mellomlagringResponse.ok) {
      throw new Error("Feil ved bundling i dp-mellomlagring");
    }

    const { urn } = await mellomlagringResponse.json();

    const dpSoknadResponse = await sendBundleTilDpSoknad(uuid, dokumentkravId, urn, DPSoknadToken);

    if (!dpSoknadResponse.ok) {
      throw new Error("Feil ved lagring av bundle i dp-soknad");
    }

    return res.status(dpSoknadResponse.status).end();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("CATCH ERROR bundleDokumentkrav(): ", error);
    return res.status(500).json(error);
  }
}

async function sendBundleTilDpSoknad(
  uuid: string,
  dokumentkravId: string,
  urn: string,
  DPSoknadToken: string
) {
  const url = `${process.env.API_BASE_URL}/soknad/${uuid}/dokumentasjonskrav/${dokumentkravId}/bundle`;
  return fetch(url, {
    method: "PUT",
    headers: headersWithToken(DPSoknadToken),
    body: JSON.stringify({ urn }),
  });
}

async function bundleFilesMellomlagring(body: BodyInit, mellomlagringToken: string) {
  const url = `${process.env.MELLOMLAGRING_BASE_URL}/pdf/bundle`;
  return fetch(url, {
    method: "POST",
    headers: headersWithToken(mellomlagringToken),
    body: JSON.stringify(body),
  });
}

export default withSentry(bundleHandler);
