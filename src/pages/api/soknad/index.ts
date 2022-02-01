import { NextApiRequest, NextApiResponse } from "next";
import { mockSeksjoner } from "../../../soknad-fakta/soknad";

const soknad = async (req: NextApiRequest, res: NextApiResponse) => {

/*  if (!soknad) {
    console.error("Fikk ingen soknad fra API");
    return { notFound: true };
  }

  const sectionIds = soknad.seksjoner.map((section) => section.id);
  const sanitySections = await sanityClient.fetch<ISeksjon[]>(fetchAllSeksjoner, {
    ids: sectionIds,
  });

  if (sanitySections.length <= 0) {
    console.error("Fant ikke seksjon i sanity");
    return { notFound: true };
  }
*/

  return res.status(200).json({ seksjoner: mockSeksjoner });
};

export default soknad;
