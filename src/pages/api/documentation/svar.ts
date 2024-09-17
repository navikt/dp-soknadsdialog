import { NextApiRequest, NextApiResponse } from "next";
import { logRequestError } from "../../../error.logger";
import { GyldigDokumentkravSvar } from "../../../types/documentation.types";
import { getErrorMessage } from "../../../utils/api.utils";
import { getSoknadOnBehalfOfToken } from "../../../utils/auth.utils";
import { getDokumentkrav } from "./[uuid]";
import { headersWithToken } from "../common/quiz-api";

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
  if (process.env.USE_MOCKS === "true") {
    return res.status(201).json({ status: "ok" });
  }

  const { uuid, dokumentkravId, dokumentkravSvar } = req.body;
  try {
    const onBehalfOf = await getSoknadOnBehalfOfToken(req);

    if (!onBehalfOf.ok) {
      return res.status(401).end();
    }

    const response = await fetch(
      `${process.env.API_BASE_URL}/soknad/${uuid}/dokumentasjonskrav/${dokumentkravId}/svar`,
      {
        method: "PUT",
        body: JSON.stringify(dokumentkravSvar),
        headers: headersWithToken(onBehalfOf.token),
      },
    );

    if (!response.ok) {
      return res.status(response.status).send(response.statusText);
    }

    const dokumentkravResponse = await getDokumentkrav(uuid, onBehalfOf.token);
    if (!dokumentkravResponse.ok) {
      return res.status(response.status).send(response.statusText);
    }

    const dokumentkrav = await dokumentkravResponse.json();
    return res.status(dokumentkravResponse.status).send(dokumentkrav);
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    logRequestError(message, uuid, "Dokumentkrav svar - failed to post svar to dp-soknad");
    return res.status(500).send(message);
  }
}

export default saveSvarHandler;
