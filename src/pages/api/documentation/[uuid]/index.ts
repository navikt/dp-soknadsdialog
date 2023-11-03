import { NextApiRequest, NextApiResponse } from "next";
import { getErrorMessage } from "../../../../api.utils";
import { headersWithToken } from "../../../../api/quiz-api";
import { getSession, getSoknadOnBehalfOfToken } from "../../../../auth.utils";
import { logRequestError } from "../../../../error.logger";
import { mockDokumentkravList } from "../../../../localhost-data/dokumentkrav-list";

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

  const session = await getSession(req);

  if (!session) {
    return res.status(401).end();
  }

  const uuid = req.query.uuid as string;
  const onBehalfOfToken = await getSoknadOnBehalfOfToken(session);

  try {
    const dokumentkravResponse = await getDokumentkrav(uuid, onBehalfOfToken);
    if (!dokumentkravResponse.ok) {
      throw new Error(dokumentkravResponse.statusText);
    }

    const dokumentkrav = await dokumentkravResponse.json();
    return res.status(dokumentkravResponse.status).send(dokumentkrav);
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    logRequestError(message, uuid, "Get dokumentkrav - Generic error");
    return res.status(500).send(message);
  }
}

export default dokumentkravHandler;
