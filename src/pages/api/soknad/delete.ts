import { withSentry } from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { audienceDPSoknad } from "../../../api.utils";
import { headersWithToken } from "../quiz-api";
import { getSession } from "../../../auth.utils";

async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).json("slettet");
  }

  const { token, apiToken } = await getSession(req);

  const {
    query: { uuid },
  } = req;

  if (!token || !apiToken) {
    return res.status(401).end();
  }

  try {
    const onBehalfOfToken = await apiToken(audienceDPSoknad);

    const deleteSoknadResponse = await fetch(`${process.env.API_BASE_URL}/${uuid}`, {
      method: "DELETE",
      headers: headersWithToken(onBehalfOfToken),
    });

    if (!deleteSoknadResponse.ok) {
      // TODO Should be logged to sentry, but it does not effect user so we do not throw error here
      throw new Error("Feil ved sletting av soknad fra dp-soknad");
    }

    const deleteSoknadState = await deleteSoknadResponse.json();
    return res.status(deleteSoknadResponse.status).send(deleteSoknadState);
  } catch (error) {
    return res.status(500).send(error);
  }
}

export default withSentry(deleteHandler);
