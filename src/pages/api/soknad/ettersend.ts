import { NextApiRequest, NextApiResponse } from "next";
import { getErrorMessage } from "../../../api.utils";
import { headersWithToken } from "../../../api/quiz-api";
import { getSession, getSoknadOnBehalfOfToken } from "../../../auth.utils";
import { logRequestError } from "../../../error.logger";

export interface IEttersendBody {
  uuid: string;
}

async function ettersendHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.USE_MOCKS === "true") {
    return res.status(201).json("Mock content");
  }

  const session = await getSession(req);
  const { uuid } = req.body;

  if (!session) {
    return res.status(401).end();
  }

  try {
    const onBehalfOfToken = await getSoknadOnBehalfOfToken(session);
    const ettersendResponse = await fetch(`${process.env.API_BASE_URL}/soknad/${uuid}/ettersend`, {
      method: "PUT",
      headers: headersWithToken(onBehalfOfToken),
    });

    if (!ettersendResponse.ok) {
      logRequestError(
        ettersendResponse.statusText,
        uuid,
        "Ettersend dokumentasjon - Failed to post ettersending"
      );
      return res.status(ettersendResponse.status).send(ettersendResponse.statusText);
    }
    return res.status(ettersendResponse.status).end();
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    logRequestError(message, uuid, "Ettersend dokumentasjon - Generic error");
    return res.status(500).send(message);
  }
}

export default ettersendHandler;
