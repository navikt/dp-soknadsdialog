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

  // const existingSvaralternativIds = existingSvaralternativer.map(
  //   (svaralternativ: any) => svaralternativ._id
  // );

  const newSanityAlternativer = allAnswerOptions
    .filter((textId) => !existingSvaralternativTextIds.includes(textId))
    .map((textId) => ({
      textId,
      text: textId,
      __i18n_lang: "nb",
      _type: "svaralternativ",
    }));

  const transaction = sanityClient.transaction();
  newSanityAlternativer.forEach((alternativ) => transaction.create(alternativ));
  // existingSvaralternativIds.forEach((id: string) => transaction.delete(id));

  const sanityResponse = await transaction.commit();

  return res.status(200).json(sanityResponse);
};

export default updateSvaralternativer;
