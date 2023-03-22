import { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import { v4 as uuidV4 } from "uuid";
import { mockGenerellInnsending } from "../../../../localhost-data/mock-generell-innsending";
import { IQuizGeneratorFaktum, QuizFaktum, QuizFaktumSvarType } from "../../../../types/quiz.types";
import { getSession } from "../../../../auth.utils";
import { audienceDPSoknad } from "../../../../api.utils";
import metrics from "../../../../metrics";
import { getSoknadState } from "../../../../api/quiz-api";
import { logRequestError } from "../../../../error.logger";

export interface ISaveFaktumBody {
  uuid: string;
  faktum: QuizFaktum | IQuizGeneratorFaktum;
  svar: QuizFaktumSvarType | QuizFaktum[][];
}

async function saveFaktumHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).json(mockGenerellInnsending);
  }

  const session = await getSession(req);
  if (!session) {
    return res.status(401).end();
  }

  const requestId = req.headers["x-request-id"] || uuidV4();
  const { uuid, faktum, svar } = req.body;

  const onBehalfOfToken = await session.apiToken(audienceDPSoknad);
  const stopTimer = metrics.backendApiDurationHistogram.startTimer({ path: "besvar-faktum" });
  const faktumResponse = await fetch(
    `${process.env.API_BASE_URL}/soknad/${uuid}/faktum/${faktum.id}`,
    {
      method: "Put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${onBehalfOfToken}`,
        "X-Request-ID": requestId,
      },
      body: JSON.stringify({ ...faktum, svar }),
    }
  );
  stopTimer();

  if (!faktumResponse.ok) {
    logRequestError(
      faktumResponse.statusText,
      uuid,
      "Save faktum - Failed to post faktum to dp-soknad"
    );
    return res.status(faktumResponse.status).send(faktumResponse.statusText);
  }

  const { sistBesvart } = await faktumResponse.json();
  const soknadStateResponse = await getSoknadState(uuid, onBehalfOfToken, sistBesvart, requestId);

  if (!soknadStateResponse.ok) {
    logRequestError(
      soknadStateResponse.statusText,
      uuid,
      "Save faktum - Failed to get new soknadState from dp-soknad"
    );
    return res.status(soknadStateResponse.status).send(soknadStateResponse.statusText);
  }

  const soknadState = await soknadStateResponse.json();
  return res.status(soknadStateResponse.status).send(soknadState);
}

export default withSentry(saveFaktumHandler);
