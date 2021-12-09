import { NextApiRequest, NextApiResponse } from "next";
import { ApiAnswer, ApiFaktum, ApiSeksjon, ApiSubFaktum } from "./mock-data";
import { sanityClient } from "../../../../sanity-client";
import {
  Answer,
  Faktum,
  SanityRef,
  Seksjon,
  SubFaktum,
  TextKeyValuePair,
} from "../../../sanity/types";
import {
  createSanityAnswerFromApiAnswer,
  createSanityFaktumFromApiFaktum,
  createSanitySeksjonFromApiSeksjon,
  createSanitySubFaktumFromApiFaktum,
} from "../../../sanity/utils";

const updateSanity = async (req: NextApiRequest, res: NextApiResponse) => {
  const quizSeksjoner: ApiSeksjon[] = await fetch(`http://localhost:3000/api/mock/seksjoner`).then(
    (data) => {
      return data.json();
    }
  );

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
  const sanityResponse = await transaction.commit();

  return res.status(200).json(sanityResponse);
};

export default updateSanity;
