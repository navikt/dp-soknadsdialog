import { NextApiRequest, NextApiResponse } from "next";
import { logRequestErrorAsInfo } from "../../../../error.logger";
import { mockDokumentkravList } from "../../../../localhost-data/dokumentkrav-list";
import { getErrorMessage } from "../../../../utils/api.utils";
import { getSoknadOnBehalfOfToken } from "../../../../utils/auth.utils";
import { headersWithToken } from "../../common/quiz-api";

export function getDokumentkrav(uuid: string, onBehalfOfToken: string) {
  return fetch(`${process.env.API_BASE_URL}/soknad/${uuid}/dokumentasjonskrav`, {
    method: "Get",
    headers: headersWithToken(onBehalfOfToken),
  });
}

async function dokumentkravHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.USE_MOCKS === "true") {
    return res.status(200).json(mockDokumentkravList);
  }

  const uuid = req.query.uuid as string;
  const onBehalfOf = await getSoknadOnBehalfOfToken(req);
  if (!onBehalfOf.ok) {
    return res.status(401).end();
  }

  try {
    const dokumentkravResponse = await getDokumentkrav(uuid, onBehalfOf.token);
    if (!dokumentkravResponse.ok) {
      throw new Error(dokumentkravResponse.statusText);
    }

    const dokumentkrav = await dokumentkravResponse.json();
    return res.status(dokumentkravResponse.status).send(dokumentkrav);
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    logRequestErrorAsInfo(message, uuid, "Get dokumentkrav - Generic error");
    return res.status(500).send(message);
  }
}

export default dokumentkravHandler;
