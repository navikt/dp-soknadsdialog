import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidV4 } from "uuid";
import { getSoknadOnBehalfOfToken } from "../../../../utils/auth.utils";
import { logRequestError } from "../../../../error.logger";
import metrics from "../../../../metrics";
import { IQuizGeneratorFaktum, QuizFaktum, QuizFaktumSvarType } from "../../../../types/quiz.types";
import { mockGenerellInnsending } from "../../../../localhost-data/mock-generell-innsending";
import { getSoknadState } from "../../common/quiz-api";
import { UUID_REGEX } from "../../../../constants";

export interface ISaveFaktumBody {
  uuid: string;
  faktum: QuizFaktum | IQuizGeneratorFaktum;
  svar: QuizFaktumSvarType | QuizFaktum[][];
}

async function saveFaktumHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.USE_MOCKS === "true") {
    return res.status(200).json(mockGenerellInnsending);
  }

  const requestId = req.headers["x-request-id"] || uuidV4();
  const { uuid, faktum, svar } = req.body;

  if (!UUID_REGEX.test(uuid)) {
    logRequestError("Ugyldig UUID format", uuid);

    return res.status(400).send("Ugyldig UUID format");
  }

  const onBehalfOf = await getSoknadOnBehalfOfToken(req);
  if (!onBehalfOf.ok) {
    return res.status(401).end();
  }

  const stopTimer = metrics.backendApiDurationHistogram.startTimer({ path: "besvar-faktum" });
  const faktumResponse = await fetch(
    `${process.env.API_BASE_URL}/soknad/${uuid}/faktum/${faktum.id}`,
    {
      method: "Put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${onBehalfOf.token}`,
        "X-Request-ID": requestId,
      },
      body: JSON.stringify({ ...faktum, svar }),
    },
  );
  stopTimer();

  if (!faktumResponse.ok) {
    logRequestError(
      faktumResponse.statusText,
      uuid,
      "Save faktum - Failed to post faktum to dp-soknad",
    );
    return res.status(faktumResponse.status).send(faktumResponse.statusText);
  }

  const { sistBesvart } = await faktumResponse.json();
  const soknadStateResponse = await getSoknadState(uuid, onBehalfOf.token, sistBesvart, requestId);

  if (!soknadStateResponse.ok) {
    logRequestError(
      soknadStateResponse.statusText,
      uuid,
      "Save faktum - Failed to get new soknadState from dp-soknad",
    );
    return res.status(soknadStateResponse.status).send(soknadStateResponse.statusText);
  }

  const soknadState = await soknadStateResponse.json();
  return res.status(soknadStateResponse.status).send(soknadState);
}

export default saveFaktumHandler;
