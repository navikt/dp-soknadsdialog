import { NextApiRequest, NextApiResponse } from "next";
import { logRequestError } from "../../../error.logger";
import { OrkestratorOpplysningType } from "../../../types/orkestrator.types";
import { getErrorMessage } from "../../../utils/api.utils";
import { getSoknadOrkestratorOnBehalfOfToken } from "../../../utils/auth.utils";
import { getOrkestratorState } from "../common/orkestrator-api";
import { QuizFaktumSvarType } from "../../../types/quiz.types";
import { UUID_REGEX } from "../../../constants";

export interface ISaveOrkestratorAnswerBody {
  uuid: string;
  opplysningId: string;
  type: OrkestratorOpplysningType;
  verdi: QuizFaktumSvarType;
}

export function saveOrkestratorAnswer(
  onBehalfOfToken: string,
  uuid: string,
  opplysningId: string,
  type: OrkestratorOpplysningType,
  verdi: QuizFaktumSvarType,
) {
  const url = `${process.env.DP_SOKNAD_ORKESTRATOR_URL}/soknad/${uuid}/svar`;

  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
    body: JSON.stringify({ opplysningId, type, verdi }),
  });
}

async function saveOrkestratorAnswerHandler(req: NextApiRequest, res: NextApiResponse) {
  const orkestratorOnBehalfOf = await getSoknadOrkestratorOnBehalfOfToken(req);
  const { uuid, type, opplysningId, verdi } = req.body;

  if (!orkestratorOnBehalfOf.ok) {
    return res.status(401).end();
  }

  if (!UUID_REGEX.test(uuid)) {
    logRequestError("Ugyldig UUID format", uuid);

    return res.status(400).send("Ugyldig UUID format");
  }

  try {
    const saveOrkestratorAnswerResponse = await saveOrkestratorAnswer(
      orkestratorOnBehalfOf.token,
      uuid,
      opplysningId,
      type,
      verdi,
    );

    if (!saveOrkestratorAnswerResponse.ok) {
      return res
        .status(saveOrkestratorAnswerResponse.status)
        .send(saveOrkestratorAnswerResponse.statusText);
    }

    const orkestratorStateResponse = await getOrkestratorState(orkestratorOnBehalfOf.token, uuid);

    if (!orkestratorStateResponse.ok) {
      return res.status(orkestratorStateResponse.status).send(orkestratorStateResponse.statusText);
    }

    const orkestratorState = await orkestratorStateResponse.json();

    return res.status(orkestratorStateResponse.status).send(orkestratorState);
  } catch (error) {
    const message = getErrorMessage(error);
    logRequestError(message, undefined, "Klarte ikke lagre orkestrator svar");
    return res.status(500).send(message);
  }
}

export default saveOrkestratorAnswerHandler;
