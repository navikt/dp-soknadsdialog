import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
import { audienceDPSoknad } from "../../../api.utils";
import { headersWithToken } from "../quiz-api";
import { withSentry } from "@sentry/nextjs";

async function getPaabegyntHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).send({ uuid: "localhost-uuid-paabegynt", startDato: "2021-10-03" });
  }

  const { token, apiToken } = await getSession({ req });
  if (!token || !apiToken) {
    return res.status(401).end();
  }

  try {
    const onBehalfOfToken = await apiToken(audienceDPSoknad);
    const paabegyntResponse = await fetch(`${process.env.API_BASE_URL}/soknad/paabegynt`, {
      method: "Get",
      headers: headersWithToken(onBehalfOfToken),
    });

    if (!paabegyntResponse.ok) {
      throw new Error(paabegyntResponse.statusText);
    }
    const data = paabegyntResponse.json();
    return res.status(paabegyntResponse.status).send(data);
  } catch (error) {
    return res.status(500).send(error);
  }
}

export default withSentry(getPaabegyntHandler);
