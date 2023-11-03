import { NextApiRequest, NextApiResponse } from "next";
import { getSoknadMal } from "../../../api/quiz-api";
import { getSession, getSoknadOnBehalfOfToken } from "../../../auth.utils";

async function malHandler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req);

  if (process.env.USE_MOCKS === "true") {
    const response = await getSoknadMal("");
    return res.status(200).json(response);
  }

  if (!session) {
    return res.status(401).end();
  }

  const onBehalfOfToken = await getSoknadOnBehalfOfToken(session);
  const response = await getSoknadMal(onBehalfOfToken);

  if (!response.ok) {
    return res.status(401).send({});
  }

  return res.status(200).json(response);
}

export default malHandler;
