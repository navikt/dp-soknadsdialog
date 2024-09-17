import { NextApiRequest, NextApiResponse } from "next";
import { getSoknadOnBehalfOfToken } from "../../../utils/auth.utils";
import { getSoknadMal } from "../common/quiz-api";

async function malHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.USE_MOCKS === "true") {
    const response = await getSoknadMal("");
    return res.status(200).json(response);
  }

  const onBehalfOf = await getSoknadOnBehalfOfToken(req);
  if (!onBehalfOf.ok) {
    return res.status(401).end();
  }

  const response = await getSoknadMal(onBehalfOf.token);
  if (!response.ok) {
    return res.status(401).send({});
  }

  return res.status(200).json(response);
}

export default malHandler;
