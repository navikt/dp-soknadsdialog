import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@navikt/dp-auth/server";
import { audienceDPSoknad } from "../../../../../api.utils";
import { withSentry } from "@sentry/nextjs";
import crypto from "crypto";

/* eslint-disable no-console */
const saveFaktumHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const requestId = crypto.randomUUID();
  console.time(`saveFaktumHandler ${requestId}`);
  const {
    query: { uuid, faktumId },
    body,
  } = req;

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).json({ status: "ok" });
  }

  console.time("getSession");
  const { token, apiToken } = await getSession({ req });
  console.timeEnd("getSession");

  if (token && apiToken) {
    console.time("onBehalfOfToken");
    const onBehalfOfToken = await apiToken(audienceDPSoknad);
    console.timeEnd("onBehalfOfToken");
    console.time("putFaktumSvar");
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
    console.timeEnd("putFaktumSvar");

    console.time("data");
    const data = await response.json();
    console.timeEnd("data");
    console.time(`saveFaktumHandler ${requestId}`);
    return res.status(response.status).json(data);
  } else {
    return res.status(401).json({ status: "ikke innlogget" });
  }
};

export default withSentry(saveFaktumHandler);
