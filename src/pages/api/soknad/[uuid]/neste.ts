import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
import { audienceDPSoknad } from "../../../../api.utils";
import { getSoknadState } from "../../quiz-api";
import { withSentry } from "@sentry/nextjs";
import { quizStateResponse } from "../../../../localhost-data/quiz-state-response";

async function nesteHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).json(quizStateResponse);
  }

  const { token, apiToken } = await getSession({ req });
  const uuid = req.query.uuid as string;
  const sistLagret = req.query.sistLagret as string | undefined;

  if (!token || !apiToken) {
    return res.status(401).end();
  }

  try {
    const onBehalfOfToken = await apiToken(audienceDPSoknad);
    const soknadStateResponse = await getSoknadState(uuid, onBehalfOfToken, sistLagret);
    if (!soknadStateResponse.ok) {
      // TODO Should be logged to sentry, but it does not effect user so we do not throw error here
      // eslint-disable-next-line no-console
      throw new Error("Feil ved henting av soknadstate fra dp-soknad");
    }

    const soknadState = await soknadStateResponse.json();
    return res.status(soknadStateResponse.status).send(soknadState);
  } catch (error) {
    return res.status(500).send(error);
  }
}

export default withSentry(nesteHandler);
