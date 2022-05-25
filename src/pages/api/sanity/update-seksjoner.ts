import { NextApiRequest, NextApiResponse } from "next";
import { blueprintDataSeksjoner } from "../../../soknad-fakta/soknad";
import { sanityClient } from "../../../../sanity-client";

const updateSeksjoner = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = '* [_type == "seksjon"]';
  const existingSeksjoner = await sanityClient.fetch(query);
  // eslint-disable-next-line
  const existingSeksjonTextIds = existingSeksjoner.map((seksjon: any) => seksjon.textId);
  // const existingSeksjonIds = existingSeksjoner.map((seksjon: any) => seksjon._id);

  const newSanitySections = blueprintDataSeksjoner
    .map((seksjon) => seksjon.id)
    .filter((textId) => !existingSeksjonTextIds.includes(textId))
    .map((textId) => ({
      textId,
      title: textId,
      _type: "seksjon",
      __i18n_lang: "nb",
    }));

  const transaction = sanityClient.transaction();
  newSanitySections.forEach((section) => transaction.create(section));
  // existingSeksjonIds.forEach((id: string) => transaction.delete(id));
  const sanityResponse = await transaction.commit();

  return res.status(200).json(sanityResponse);
};

export default updateSeksjoner;
