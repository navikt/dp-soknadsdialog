import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { Personalia } from "../../../types/personalia.types";
import { getSession } from "@navikt/dp-auth/server";
import { audience } from "../../../api.utils";

// As of https://tools.ietf.org/html/rfc7807
export interface HttpProblem {
  type: URL;
  title: string;
  status?: number;
  detail?: string;
  instance?: URL;
}

const isHttpProblem = (variableToCheck: unknown): variableToCheck is HttpProblem =>
  (variableToCheck as HttpProblem).type !== undefined;

function getPersonalia(onBehalfOfToken: string) {
  return fetch(`${process.env.API_BASE_URL}/personalia`, {
    method: "Get",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  }).then(async (respons: Response) => {
    if (!respons.ok) {
      return Promise.reject<HttpProblem>(await respons.json());
    }
    return respons.json();
  });
}

const personaliaHandler: NextApiHandler<Personalia | HttpProblem> = async (
  req: NextApiRequest,
  res: NextApiResponse<Personalia | HttpProblem>
) => {
  try {
    const { token, apiToken } = await getSession({ req });
    if (token && apiToken) {
      const onBehalfOfToken = await apiToken(audience);
      const personalia = await getPersonalia(onBehalfOfToken);
      return res.json(personalia);
    } else {
      return res.status(401).json({
        status: 401,
        title: "Ikke innlogget",
        type: new URL("urn:oppslag:personalia"),
      });
    }
  } catch (error) {
    if (isHttpProblem(error)) {
      const httpProblem: HttpProblem = <HttpProblem>error;
      // eslint-disable-next-line no-console
      console.error(`Kall mot personalia API feilet. Feilmelding: ${httpProblem.title}`);
      return res
        .status(httpProblem.status !== undefined ? httpProblem.status : 500)
        .json(httpProblem);
    } else {
      const httpProblem: HttpProblem = {
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

export default personaliaHandler;
