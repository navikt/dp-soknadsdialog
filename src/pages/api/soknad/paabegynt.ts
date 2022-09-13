import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
import { audienceDPSoknad } from "../../../api.utils";
import { getPaabegynt } from "../quiz-api";
import { withSentry } from "@sentry/nextjs";

async function getPaabegyntHandler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).send({ uuid: "localhost-uuid-paabegynt", startDato: "2021-10-03" });
  }

  const { token, apiToken } = await getSession({ req });
  let paabegynt;
  if (token && apiToken) {
    const onBehalfOfToken = await apiToken(audienceDPSoknad);
    paabegynt = await getPaabegynt(onBehalfOfToken);
    return res.status(200).json(paabegynt);
  } else {
    return res.status(401).send({});
  }
}

export default withSentry(getPaabegyntHandler);
