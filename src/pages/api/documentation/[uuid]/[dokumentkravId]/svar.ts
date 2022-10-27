import { NextApiRequest, NextApiResponse } from "next";
import { audienceDPSoknad } from "../../../../../api.utils";
import { withSentry } from "@sentry/nextjs";
import { headersWithToken } from "../../../quiz-api";
import { getSession } from "../../../../../auth.utils";

async function saveSvarHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(201).json({ status: "ok" });
  }

  const session = await getSession(req);

  if (!session) {
    return res.status(401).end();
  }

  const uuid = req.query.uuid as string;
  const dokumentkravId = req.query.dokumentkravId as string;

  try {
    const onBehalfOfToken = await session.apiToken(audienceDPSoknad);
    const response = await fetch(
      `${process.env.API_BASE_URL}/soknad/${uuid}/dokumentasjonskrav/${dokumentkravId}/svar`,
      {
        method: "PUT",
        body: req.body,
        headers: headersWithToken(onBehalfOfToken),
      }
    );

    if (!response.ok) {
      throw new Error(`unexpected response ${response.statusText}`);
    }

    return res.status(200).send(response.body);
  } catch (error: unknown) {
    return res.status(500).send(error);
  }
}

export default withSentry(saveSvarHandler);
