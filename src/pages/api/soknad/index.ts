import { getSession } from "@navikt/dp-auth/server";
import { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "../../../../sanity-client";
import { audience } from "../../../api.utils";
import { fetchAllSeksjoner } from "../../../sanity/groq-queries";
import { getFakta, postSoknad } from "../../../server-side/quiz-api";
import { ISeksjon } from "../../../types/seksjon.types";

export interface ISoknad {
  sections: ISeksjon[];
  soknadId: string;
}

const soknad = async (req: NextApiRequest, res: NextApiResponse) => {
  const sanitySections = await sanityClient.fetch<ISeksjon[]>(fetchAllSeksjoner);
  const { token, apiToken } = await getSession({ req });
  let soknadId;
  if (token && apiToken) {
    const onBehalfOfToken = await apiToken(audience);
    soknadId = await postSoknad(onBehalfOfToken);
    // eslint-disable-next-line no-console
    console.log(soknadId);
  }

  const fakta = await getFakta("test", "asdasd");

  if (sanitySections.length <= 0) {
    // eslint-disable-next-line no-console
    console.error("Fant ikke seksjon i sanity");
    return res.status(404);
  }

  return res.status(200).json({ sections: sanitySections, soknadId, fakta });
};

export default soknad;
