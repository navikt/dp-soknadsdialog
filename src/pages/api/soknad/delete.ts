import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { audienceDPSoknad } from "../../../api.utils";
import { headersWithToken } from "../quiz-api";
import { getSession } from "../../../auth.utils";

async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).json("slettet");
  }

  const session = await getSession(req);
  const uuid = req.body.uuid;

  if (!session) {
    return res.status(401).end();
  }

  try {
    const onBehalfOfToken = await session.apiToken(audienceDPSoknad);

    const deleteSoknadResponse = await fetch(`${process.env.API_BASE_URL}/soknad/${uuid}`, {
      method: "DELETE",
      headers: headersWithToken(onBehalfOfToken),
    });

    if (!deleteSoknadResponse.ok) {
      // TODO Should be logged to sentry, but it does not effect user so we do not throw error here
      throw new Error("Feil ved sletting av soknad fra dp-soknad");
    }

    return res.json(deleteSoknadResponse);
  } catch (error) {
    return res.status(500).send(error);
  }
}

export default withSentry(deleteHandler);
