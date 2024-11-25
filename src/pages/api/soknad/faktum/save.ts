import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidV4 } from "uuid";
import { logRequestError } from "../../../../error.logger";
import { mockGenerellInnsending } from "../../../../localhost-data/mock-generell-innsending";
import metrics from "../../../../metrics";
import { IQuizGeneratorFaktum, QuizFaktum, QuizFaktumSvarType } from "../../../../types/quiz.types";
import { getSoknadOnBehalfOfToken } from "../../../../utils/auth.utils";
import { getSoknadState } from "../../common/quiz-api";

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

  const onBehalfOf = await getSoknadOnBehalfOfToken(req);
  if (!onBehalfOf.ok) {
    return res.status(401).end();
  }

  const stopTimer = metrics.backendApiDurationHistogram.startTimer({ path: "besvar-faktum" });
  // TODO: Fortsett her
  // Feil ved lagring faktum til quiz
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

  console.log(`🔥 uuid :`, uuid);
  console.log(`🔥 faktum.id :`, faktum.id);
  console.log(`🔥 faktumResponse :`, faktumResponse);

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
