import { NextApiRequest, NextApiResponse } from "next";
import { audienceDPSoknad } from "../../../../../api.utils";
import { withSentry } from "@sentry/nextjs";
import { v4 as uuidV4 } from "uuid";
import metrics from "../../../../../metrics";
import { getSession } from "../../../../../auth.utils";
import { getSoknadState } from "../../../quiz-api";
import { mockGenerellInnsending } from "../../../../../localhost-data/mock-generell-innsending";

const saveFaktumHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).json(mockGenerellInnsending);
  }

  const session = await getSession(req);
  const uuid = req.query.uuid as string;
  const faktumId = req.query.faktumId as string;
  const requestId = uuidV4();

  if (!session) {
    return res.status(401).end();
  }

  const onBehalfOfToken = await session.apiToken(audienceDPSoknad);
  const stopTimer = metrics.backendApiDurationHistogram.startTimer({ path: "besvar-faktum" });
  const faktumResponse = await fetch(
    `${process.env.API_BASE_URL}/soknad/${uuid}/faktum/${faktumId}`,
    {
      method: "Put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${onBehalfOfToken}`,
        "X-Request-ID": requestId,
      },
      body: req.body,
    }
  );
  stopTimer();

  if (!faktumResponse.ok) {
    return res.status(faktumResponse.status).send(faktumResponse.statusText);
  }

  const { sistBesvart } = await faktumResponse.json();
  const soknadStateResponse = await getSoknadState(uuid, onBehalfOfToken, sistBesvart);

  if (!soknadStateResponse.ok) {
    return res.status(soknadStateResponse.status).send(soknadStateResponse.statusText);
  }

  const soknadState = await soknadStateResponse.json();
  return res.status(soknadStateResponse.status).send(soknadState);
};

export default withSentry(saveFaktumHandler);
