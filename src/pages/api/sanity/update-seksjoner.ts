import { NextApiRequest, NextApiResponse } from "next";
import { blueprintDataSeksjoner } from "../../../soknad-fakta/soknad";
import { sanityClient } from "../../../../sanity-client";

const updateSeksjoner = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = '* [_type == "seksjon"]';
  const existingSeksjoner = await sanityClient.fetch(query);
  // eslint-disable-next-line
  const existingSeksjonTextIds = existingSeksjoner.map((seksjon: any) => seksjon.textId);

  const newSanitySections = blueprintDataSeksjoner
    .map((seksjon) => seksjon.id)
    .filter((textId) => !existingSeksjonTextIds.includes(textId))
    .map((textId) => ({
      _type: "seksjon",
      textId,
      title: textId,
    }));

  const transaction = sanityClient.transaction();
  newSanitySections.forEach((section) => transaction.create(section));
  const sanityResponse = await transaction.commit();

  return res.status(200).json(sanityResponse);
};

export default updateSeksjoner;
