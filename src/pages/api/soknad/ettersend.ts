import { NextApiRequest, NextApiResponse } from "next";
import { logRequestErrorAsInfo } from "../../../error.logger";
import { getErrorMessage } from "../../../utils/api.utils";
import { getSoknadOnBehalfOfToken } from "../../../utils/auth.utils";
import { headersWithToken } from "../common/quiz-api";

export interface IEttersendBody {
  uuid: string;
}

async function ettersendHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.USE_MOCKS === "true") {
    return res.status(201).json("Mock content");
  }

  const { uuid } = req.body;

  try {
    const onBehalfOf = await getSoknadOnBehalfOfToken(req);
    if (!onBehalfOf.ok) {
      return res.status(401).end();
    }

    const ettersendResponse = await fetch(`${process.env.API_BASE_URL}/soknad/${uuid}/ettersend`, {
      method: "PUT",
      headers: headersWithToken(onBehalfOf.token),
    });

    if (!ettersendResponse.ok) {
      logRequestErrorAsInfo(
        ettersendResponse.statusText,
        uuid,
        "Ettersend dokumentasjon - Failed to post ettersending",
      );
      return res.status(ettersendResponse.status).send(ettersendResponse.statusText);
    }
    return res.status(ettersendResponse.status).end();
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    logRequestErrorAsInfo(message, uuid, "Ettersend dokumentasjon - Generic error");
    return res.status(500).send(message);
  }
}

export default ettersendHandler;
