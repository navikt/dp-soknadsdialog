import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@navikt/dp-auth/server";
import { audienceDPSoknad } from "../../../../../api.utils";
import { withSentry } from "@sentry/nextjs";
import crypto from "crypto";

const saveFaktumHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).json({ status: "ok" });
  }

  const { token, apiToken } = await getSession({ req });
  const requestId = crypto.randomUUID();
  const {
    query: { uuid, faktumId },
    body,
  } = req;

  if (!token || !apiToken) {
    return res.status(401).json({ status: "ikke innlogget" });
  }

  const onBehalfOfToken = await apiToken(audienceDPSoknad);
  const response: Response = await fetch(
    `${process.env.API_BASE_URL}/soknad/${uuid}/faktum/${faktumId}`,
    {
      method: "Put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${onBehalfOfToken}`,
        "X-Request-ID": requestId,
      },
      body,
    }
  );

  const data = await response.json();
  return res.status(response.status).json(data);
};

export default withSentry(saveFaktumHandler);
