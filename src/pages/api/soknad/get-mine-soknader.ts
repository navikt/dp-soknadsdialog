import { GET_MINE_SOKNADER_ERROR } from "./../../../sentry-constants";
import { NextApiRequest, NextApiResponse } from "next";
import { audienceDPSoknad } from "../../../api.utils";
import { withSentry } from "@sentry/nextjs";
import { formatISO, subDays } from "date-fns";
import { getSession } from "../../../auth.utils";
import { logFetchError } from "../../../sentry.logger";

export function getMineSoknader(onBehalfOfToken: string) {
  // Finn ut hvor mange dager tilbake i tid vi skal ha
  const fromDate = subDays(Date.now(), 3);
  const formattedDate = formatISO(fromDate, { representation: "date" });

  const url = `${process.env.API_BASE_URL}/soknad/mine-soknader?fom=${formattedDate}`;
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  });
}

async function getMineSoknaderHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req);

    if (!session) {
      return res.status(401).end();
    }

    const onBehalfOfToken = await session.apiToken(audienceDPSoknad);
    const response = await getMineSoknader(onBehalfOfToken);

    if (!response.ok) {
      logFetchError(GET_MINE_SOKNADER_ERROR);
      throw new Error(`unexpected response ${response.statusText}`);
    }

    return res.json(response);
  } catch (error) {
    logFetchError(GET_MINE_SOKNADER_ERROR);
    return res.status(500).send(error);
  }
}

export default withSentry(getMineSoknaderHandler);
