import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
import { audienceDPSoknad } from "../../../api.utils";
import { withSentry } from "@sentry/nextjs";
import { formatISO, subDays } from "date-fns";

export function getMineSoknader(onBehalfOfToken: string) {
  // Finn ut hvor mange dager tilbake i tid vi skal ha
  const fromDate = subDays(Date.now(), 7);
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
    const { token, apiToken } = await getSession({ req });

    if (!token || !apiToken) {
      return res.status(401).end();
    }

    const onBehalfOfToken = await apiToken(audienceDPSoknad);
    const response = await getMineSoknader(onBehalfOfToken);

    if (!response.ok) {
      throw new Error(`unexpected response ${response.statusText}`);
    }

    return res.json(response);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return res.status(500).send(error);
  }
}

export default withSentry(getMineSoknaderHandler);
