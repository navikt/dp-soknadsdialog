import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "../../../../sanity-client";
import { audience } from "../../../api.utils";
import { fetchAllSeksjoner } from "../../../sanity/groq-queries";
import { postSoknad } from "../../../server-side/quiz-api";
import { ISeksjon } from "../../../types/seksjon.types";

export interface ISoknad {
  sections: ISeksjon[];
}

const soknad = async (req: NextApiRequest, res: NextApiResponse) => {
  const sanitySections = await sanityClient.fetch<ISeksjon[]>(fetchAllSeksjoner);
  const { token, apiToken } = await getSession({ req });
  let nySoknad;
  if (token && apiToken) {
    const onBehalfOfToken = await apiToken(audience);
    nySoknad = await postSoknad(onBehalfOfToken);
    // eslint-disable-next-line no-console
    console.log(nySoknad);
  }

  if (sanitySections.length <= 0) {
    // eslint-disable-next-line no-console
    console.error("Fant ikke seksjon i sanity");
    return res.status(404);
  }

  return res.status(200).json({ sections: sanitySections, nySoknad });
};

export default soknad;
