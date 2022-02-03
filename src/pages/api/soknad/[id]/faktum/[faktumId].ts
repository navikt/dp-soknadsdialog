import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@navikt/dp-auth/server";
import { audience } from "../../../../../api.utils";

const saveFaktumHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { id, faktumId },
  } = req;

  const { token, apiToken } = await getSession({ req });

  if (token && apiToken) {
    const frontendToken = await apiToken(audience);
    const response: Response = await fetch(
      `${process.env.API_BASE_URL}/soknad/${id}/faktum/${faktumId}`,
      {
        method: "Put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${frontendToken}`,
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
