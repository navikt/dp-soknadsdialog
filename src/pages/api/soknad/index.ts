import { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "../../../../sanity-client";
import { fetchAllSeksjoner } from "../../../sanity/groq-queries";
import { ISeksjon } from "../../../types/seksjon.types";

export interface ISoknad {
  sections: ISeksjon[];
}

const soknad = async (req: NextApiRequest, res: NextApiResponse) => {

  const sanitySections = await sanityClient.fetch<ISeksjon[]>(fetchAllSeksjoner);
  
  if (sanitySections.length <= 0) {
    console.error("Fant ikke seksjon i sanity");
    return res.status(404);
  }

  return res.status(200).json({ sections: sanitySections });
};

export default soknad;
