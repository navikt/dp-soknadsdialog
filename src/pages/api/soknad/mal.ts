import { NextApiRequest, NextApiResponse } from "next";
import { audienceDPSoknad } from "../../../api.utils";
import { getSoknadMal } from "../../../api/quiz-api";
import { withSentry } from "@sentry/nextjs";
import { getSession } from "../../../auth.utils";

async function malHandler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req);
  let soknadMal;

  if (session) {
    const onBehalfOfToken = await session.apiToken(audienceDPSoknad);
    soknadMal = await getSoknadMal(onBehalfOfToken);
    return res.status(200).json(soknadMal);
  } else {
    return res.status(401).send({});
  }
}

export default withSentry(malHandler);
