import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
import { audience } from "../../../../../api.utils";
import { withSentry } from "@sentry/nextjs";

async function uploadHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(201).json({ status: "ok" });
  }

  const { token, apiToken } = await getSession({ req });
  const uuid = req.query.uuid as string;
  const dokumentkravId = req.query.dokumentkravId as string;

  if (token && apiToken) {
    try {
      const onBehalfOfToken = await apiToken(audience);
      const response = await fetch(
        `${process.env.API_BASE_URL}/soknad/${uuid}/dokumentasjonskrav/${dokumentkravId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${onBehalfOfToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`unexpected response ${response.statusText}`);
      }

      return res.status(200).send(response.body);
    } catch (error: unknown) {
      return res.status(404);
    }
  }
}

export default withSentry(uploadHandler);
