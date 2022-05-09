import { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "../../../../sanity-client";
import { alleFakta } from "../../../soknad-fakta/alle-fakta";

const updateFakta = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = '* [_type == "faktum"]';
  const existingFaktum = await sanityClient.fetch(query);
  // eslint-disable-next-line
  const existingFaktumTextIds = existingFaktum.map((faktum: any) => faktum.textId);

  const newSanityFakta = alleFakta
    .filter((textId) => !existingFaktumTextIds.includes(textId))
    .map((textId) => ({
      _type: "faktum",
      textId,
      text: textId,
    }));

  const transaction = sanityClient.transaction();
  newSanityFakta.forEach((faktum) => transaction.create(faktum));
  const sanityResponse = await transaction.commit();

  return res.status(200).json(sanityResponse);
};

export default updateFakta;
