import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@navikt/dp-auth/server";
import { audience } from "../../../../../api.utils";

const saveFaktumHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { uuid, faktumId },
    body,
  } = req;

  if (process.env.NEXT_PUBLIC_LOCALHOST) {
    return res.status(200).json({ status: "ok" });
  }

  const { token, apiToken } = await getSession({ req });

  if (token && apiToken) {
    const onBehalfOfToken = await apiToken(audience);
    const response: Response = await fetch(
      `${process.env.API_BASE_URL}/soknad/${uuid}/faktum/${faktumId}`,
      {
        method: "Put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${onBehalfOfToken}`,
        },
        body,
      }
    );
    return res.status(response.status).json(await response.json());
  } else {
    return res.status(401).json({ status: "ikke innlogget" });
  }
};

export default saveFaktumHandler;
