import { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "../../../../sanity-client";
import api, { host } from "../../../api.utils";
import { fetchAllSeksjoner } from "../../../sanity/groq-queries";
import { ISeksjon } from "../../../types/seksjon.types";

export interface ISoknad {
  sections: ISeksjon[];
}

const soknad = async (req: NextApiRequest, res: NextApiResponse) => {
  const sanitySections = await sanityClient.fetch<ISeksjon[]>(fetchAllSeksjoner);

  const fakta = await fetch(new URL(`${api("soknad/123/fakta")}`, host).href).then((data) => {
    return data.json();
  });
  // eslint-disable-next-line no-console
  console.log(fakta);

  if (sanitySections.length <= 0) {
    // eslint-disable-next-line no-console
    console.error("Fant ikke seksjon i sanity");
    return res.status(404);
  }

  return res.status(200).json({ sections: sanitySections });
};

export default soknad;
