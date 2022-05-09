import { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "../../../../sanity-client";
import { allAnswerOptions } from "../../../soknad-fakta/answer-options";

const updateSvaralternativer = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = '* [_type == "svaralternativ"]';
  const existingSvaralternativer = await sanityClient.fetch(query);
  const existingSvaralternativTextIds = existingSvaralternativer.map(
    // eslint-disable-next-line
    (alternativ: any) => alternativ?.textId
  );

  const newSanityAlternativer = allAnswerOptions
    .filter((textId) => !existingSvaralternativTextIds.includes(textId))
    .map((textId) => ({
      _type: "svaralternativ",
      textId,
      text: textId,
    }));

  const transaction = sanityClient.transaction();
  newSanityAlternativer.forEach((alternativ) => transaction.create(alternativ));
  const sanityResponse = await transaction.commit();

  return res.status(200).json(sanityResponse);
};

export default updateSvaralternativer;
