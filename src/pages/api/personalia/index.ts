import { NextApiRequest, NextApiResponse } from "next";
import { audienceDPSoknad } from "../../../api.utils";
import { withSentry } from "@sentry/nextjs";
import { getSession } from "../../../auth.utils";
import { logRequestError } from "../../../sentry.logger";
import { GET_PERSONALIA_ERROR } from "../../../sentry-constants";

export function getPersonalia(onBehalfOfToken: string) {
  const url = `${process.env.API_BASE_URL}/personalia`;
  return fetch(url, {
    method: "Get",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });
}

const personaliaHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getSession(req);

    if (!session) {
      return res.status(401).end();
    }

    const onBehalfOfToken = await session.apiToken(audienceDPSoknad);
    const response = await getPersonalia(onBehalfOfToken);

    if (!response.ok) {
      logRequestError(GET_PERSONALIA_ERROR);
      throw new Error(`unexpected response ${response.statusText}`);
    }

    return res.json(response);
  } catch (error) {
    logRequestError(GET_PERSONALIA_ERROR);
    return res.status(500).send(error);
  }
};

export default withSentry(personaliaHandler);
