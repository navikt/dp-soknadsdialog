import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@navikt/dp-auth/server";

const audience = `${process.env.NAIS_CLUSTER_NAME}:teamdagpenger:dp-quizshow-api`;

const saveFaktumHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { id, faktumId },
  } = req;

  const { token, apiToken } = await getSession({ req });
  if (token) {
    const quizShowToken = await apiToken(audience);
    const response: Response = await fetch(
      `${process.env.API_BASE_URL}/soknad/${id}/faktum/${faktumId}`,
      {
        method: "Put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${quizShowToken}`,
        },
        body: JSON.stringify(req.body),
      }
    );
    return res.status(response.status).json(await response.json());
  } else {
    return res.status(401).json({ status: "ikke innlogget" });
  }
};

export default saveFaktumHandler;
