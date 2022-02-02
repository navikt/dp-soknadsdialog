import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { HttpProblem, Person } from "../../../types/personalia.types";
import { getSession } from "@navikt/dp-auth/server";
import { audience } from "../../../api.utils";

const isHttpProblem = (variableToCheck: unknown): variableToCheck is HttpProblem =>
  (variableToCheck as HttpProblem).title !== undefined;

export const personaliaHenter: NextApiHandler<Person | HttpProblem> = async (
  req: NextApiRequest,
  res: NextApiResponse<Person | HttpProblem>
) => {
  try {
    const { token, apiToken } = await getSession({ req });
    if (token && apiToken) {
      const onBehalfOfToken = await apiToken(audience);
      const person = await fetch(`${process.env.API_BASE_URL}/personalia`, {
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
      return res.json(person);
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
      console.error(`Kall mot personalia API feilet. Feilmelding: ${error}`);
      return res.status(500).json(httpProblem);
    }
  }
};
