import { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "../../../../sanity-client";
import {
  createSanityAnswerFromApiAnswer,
  createSanityFaktumFromApiFaktum,
  createSanitySeksjonFromApiSeksjon,
  createSanitySubFaktumFromApiFaktum,
} from "../../../sanity/utils";

const updateSanity = async (req: NextApiRequest, res: NextApiResponse) => {
  const quizSeksjoner: MockDataSeksjon[] = await fetch(
    `http://localhost:3000/api/mock/seksjoner`
  ).then((data) => {
    return data.json();
  });

  let documents: { _id: string; _type: string }[] = [];
  const seksjoner = quizSeksjoner.map((apiSection) => {
    const faktum = apiSection.faktum.map((apiFaktum) => {
      const subFaktum = apiFaktum.subFaktum.map((apiSubFaktum) => {
        const answers = apiSubFaktum.answers.map(createSanityAnswerFromApiAnswer);
        documents = [...documents, ...answers];

        return createSanitySubFaktumFromApiFaktum(apiSubFaktum, answers);
      });
      documents = [...documents, ...subFaktum];

      const answers = apiFaktum.answers.map(createSanityAnswerFromApiAnswer);
      documents = [...documents, ...answers];

      return createSanityFaktumFromApiFaktum(apiFaktum, answers);
    });

    documents = [...documents, ...faktum];

    return createSanitySeksjonFromApiSeksjon(apiSection, faktum);
  });

  documents = [...documents, ...seksjoner];

  const transaction = sanityClient.transaction();
  documents.forEach((doc) => transaction.createIfNotExists(doc));
  // documents.forEach((doc) => transaction.delete(doc._id));
  const sanityResponse = await transaction.commit();

  return res.status(200).json(sanityResponse);
};

export default updateSanity;
