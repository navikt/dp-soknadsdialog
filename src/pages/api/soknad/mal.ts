import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
import { audience } from "../../../api.utils";
import { getSoknadMal } from "./quiz-api";
import { withSentry } from "@sentry/nextjs";

async function getMal(req: NextApiRequest, res: NextApiResponse) {
  const { token, apiToken } = await getSession({ req });
  let soknadMal;

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    soknadMal = await getSoknadMal("");
    return res.status(200).json(soknadMal);
  }

  if (token && apiToken) {
    const onBehalfOfToken = await apiToken(audience);
    soknadMal = await getSoknadMal(onBehalfOfToken);
    return res.status(200).json(soknadMal);
  } else {
    return res.status(401).send({});
  }
}

export default withSentry(getMal);
