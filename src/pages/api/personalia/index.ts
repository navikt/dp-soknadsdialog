import { NextApiRequest, NextApiResponse } from "next";
import { audienceDPSoknad, getErrorMessage } from "../../../api.utils";
import { getSession } from "../../../auth.utils";
import { logRequestError } from "../../../error.logger";

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
      logRequestError(response.statusText, undefined, "Personalia - Failed to get info");
      return res.status(response.status).send(response.statusText);
    }

    return res.status(response.status).json(response);
  } catch (error) {
    const message = getErrorMessage(error);
    logRequestError(message, undefined, "Personalia - Generic error");
    return res.status(500).send(message);
  }
};

export default personaliaHandler;
