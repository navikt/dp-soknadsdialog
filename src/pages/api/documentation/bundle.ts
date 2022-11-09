import { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import { audienceDPSoknad, audienceMellomlagring } from "../../../api.utils";
import { getSession } from "../../../auth.utils";
import { headersWithToken } from "../quiz-api";

export interface IDocumentationBundleBody {
  uuid: string;
  dokumentkravId: string;
  fileUrns: { urn: string }[];
}

async function bundleHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).json({ status: "ok" });
  }

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
      mellomlagringToken
    );
    if (!mellomlagringResponse.ok) {
      throw new Error("Feil ved bundling i dp-mellomlagring");
    }

    console.log(`bundlet ${dokumentkravId}`);
    const { urn } = await mellomlagringResponse.json();
    const dpSoknadResponse = await sendBundleTilDpSoknad(uuid, dokumentkravId, urn, DPSoknadToken);

    if (!dpSoknadResponse.ok) {
      throw new Error("Feil ved lagring av bundle i dp-soknad");
    }
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
  DPSoknadToken: string
) {
  const url = `${process.env.API_BASE_URL}/soknad/${uuid}/dokumentasjonskrav/${dokumentkravId}/bundle`;
  return fetch(url, {
    method: "PUT",
    headers: headersWithToken(DPSoknadToken),
    body: JSON.stringify({ urn }),
  });
}

interface IMellomlagringBundle {
  soknadId: string;
  bundleNavn: string;
  filer: { urn: string }[];
}

async function bundleFilesMellomlagring(body: IMellomlagringBundle, mellomlagringToken: string) {
  const url = `${process.env.MELLOMLAGRING_BASE_URL}/pdf/bundle`;
  return fetch(url, {
    method: "POST",
    headers: headersWithToken(mellomlagringToken),
    body: JSON.stringify(body),
  });
}

export default withSentry(bundleHandler);
