import { NextApiRequest, NextApiResponse } from "next";
import { logRequestError } from "../../../error.logger";
import { OrkestratorSpørsmalType } from "../../../types/orkestrator.types";
import { getErrorMessage } from "../../../utils/api.utils";
import { getSoknadOrkestratorOnBehalfOfToken } from "../../../utils/auth.utils";
import { getNesteOrkestratorSporsmal } from "../common/orkestrator-api";

export interface ISaveOrkestratorAnswerBody {
  uuid: string;
  spørsmålId: string;
  type: OrkestratorSpørsmalType;
  verdi: string;
}

export function saveOrkestratorAnswer(
  onBehalfOfToken: string,
  uuid: string,
  spørsmålId: string,
  type: OrkestratorSpørsmalType,
  verdi: string,
) {
  const url = `${process.env.DP_SOKNAD_ORKESTRATOR_URL}/soknad/${uuid}/svar`;

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
    body: JSON.stringify({ spørsmålId, type, verdi }),
  });
}

async function saveOrkestratorAnswerHandler(req: NextApiRequest, res: NextApiResponse) {
  const orkestratorOnBehalfOf = await getSoknadOrkestratorOnBehalfOfToken(req);
  const { uuid, type, spørsmålId, verdi } = req.body;

  if (!orkestratorOnBehalfOf.ok) {
    return res.status(401).end();
  }

  try {
    const saveOrkestratorAnswerResponse = await saveOrkestratorAnswer(
      orkestratorOnBehalfOf.token,
      uuid,
      spørsmålId,
      type,
      verdi,
    );

    if (!saveOrkestratorAnswerResponse.ok) {
      return res
        .status(saveOrkestratorAnswerResponse.status)
        .send(saveOrkestratorAnswerResponse.statusText);
    }

    const getNesteOrkestratorSporsmalResponse = await getNesteOrkestratorSporsmal(
      orkestratorOnBehalfOf.token,
      uuid,
    );

    if (!getNesteOrkestratorSporsmalResponse.ok) {
      return res.json({ error: true });
    }

    return res.json(getNesteOrkestratorSporsmalResponse.json());
  } catch (error) {
    const message = getErrorMessage(error);
    logRequestError(message, undefined, "Get new uuid - Generic error");
    return res.status(500).send(message);
  }
}

export default saveOrkestratorAnswerHandler;
