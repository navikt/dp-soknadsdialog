import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { IPersonalia } from "../../../types/personalia.types";
import { getSession } from "@navikt/dp-auth/server";
import { audienceDPSoknad } from "../../../api.utils";
import { withSentry } from "@sentry/nextjs";
import { mockPersonalia } from "../../../localhost-data/personalia";

// As of https://tools.ietf.org/html/rfc7807
export interface IHttpProblem {
  type: URL;
  title: string;
  status?: number;
  detail?: string;
  instance?: URL;
}

const isHttpProblem = (variableToCheck: unknown): variableToCheck is IHttpProblem =>
  (variableToCheck as IHttpProblem).type !== undefined;

function getPersonalia(onBehalfOfToken: string) {
  return fetch(`${process.env.API_BASE_URL}/personalia`, {
    method: "Get",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  }).then(async (response: Response) => {
    if (!response.ok) {
      return Promise.reject<IHttpProblem>(await response.json());
    }
    return response.json();
  });
}

const personaliaHandler: NextApiHandler<IPersonalia | IHttpProblem> = async (
  req: NextApiRequest,
  res: NextApiResponse<IPersonalia | IHttpProblem>
) => {
  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).json(mockPersonalia);
  }

  try {
    const { token, apiToken } = await getSession({ req });

    if (!token || !apiToken) {
      return res.status(401).end();
    }

    const onBehalfOfToken = await apiToken(audienceDPSoknad);
    const personalia = await getPersonalia(onBehalfOfToken);
    return res.json(personalia);
  } catch (error) {
    if (isHttpProblem(error)) {
      const httpProblem: IHttpProblem = <IHttpProblem>error;
      // eslint-disable-next-line no-console
      console.error(`Kall mot personalia API feilet. Feilmelding: ${httpProblem.title}`);
      return res
        .status(httpProblem.status !== undefined ? httpProblem.status : 500)
        .json(httpProblem);
    } else {
      const httpProblem: IHttpProblem = {
        status: 500,
        title: "Noe galt ved personalia kall",
        type: new URL("urn:oppslag:personalia"),
      };
      // eslint-disable-next-line no-console
      console.error(`Kall mot personalia API feilet. Feilmelding: ${error}`);
      return res.status(500).json(httpProblem);
    }
  }
};

export default withSentry(personaliaHandler);
