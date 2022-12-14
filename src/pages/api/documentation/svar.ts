import { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import { getSession } from "../../../auth.utils";
import { audienceDPSoknad, getErrorMessage } from "../../../api.utils";
import { headersWithToken } from "../../../api/quiz-api";
import { logRequestError } from "../../../sentry.logger";
import { GyldigDokumentkravSvar } from "../../../types/documentation.types";

export interface IDokumentkravSvarBody {
  uuid: string;
  dokumentkravId: string;
  dokumentkravSvar: IDokumentkravSvar;
}

export interface IDokumentkravSvar {
  svar: GyldigDokumentkravSvar;
  begrunnelse?: string;
}

async function saveSvarHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(201).json({ status: "ok" });
  }

  const session = await getSession(req);
  if (!session) {
    return res.status(401).end();
  }

  const { uuid, dokumentkravId, dokumentkravSvar } = req.body;
  try {
    const onBehalfOfToken = await session.apiToken(audienceDPSoknad);
    const response = await fetch(
      `${process.env.API_BASE_URL}/soknad/${uuid}/dokumentasjonskrav/${dokumentkravId}/svar`,
      {
        method: "PUT",
        body: JSON.stringify(dokumentkravSvar),
        headers: headersWithToken(onBehalfOfToken),
      }
    );

    if (!response.ok) {
      return res.status(response.status).send(response.statusText);
    }

    return res.status(response.status).send(response.body);
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    logRequestError(message);
    return res.status(500).send(message);
  }
}

export default withSentry(saveSvarHandler);
