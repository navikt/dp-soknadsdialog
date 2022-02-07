import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
import { audience } from "../../../../api.utils";

function getFakta(soknadId: string, onBehalfOfToken: string) {
  return fetch(`${process.env.API_BASE_URL}/soknad/${soknadId}/fakta`, {
    method: "Get",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${onBehalfOfToken}`,
    },
  })
    .then((response: Response) => {
      return response.json();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

const faktaHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  const soknadsUUID = query.id as string;

  const { token, apiToken } = await getSession({ req });

  if (token && apiToken) {
    const onBehalfOfToken = await apiToken(audience);
    const fakta = await getFakta(soknadsUUID, onBehalfOfToken);
    // eslint-disable-next-line no-console
    console.log("FAKTA:", fakta);
    return res.status(200).json({ fakta });
  } else {
    return res.status(401);
  }
};

export default faktaHandler;
