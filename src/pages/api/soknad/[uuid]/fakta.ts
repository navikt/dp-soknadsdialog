import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
import { audience } from "../../../../api.utils";
import { getFakta } from "../../../../server-side/quiz-api";

const faktaHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  const soknadsUUID = query.id as string;

  const { token, apiToken } = await getSession({ req });
  const fakta = await getFakta(soknadsUUID, "asdad");
  return res.status(200).json(fakta);

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
