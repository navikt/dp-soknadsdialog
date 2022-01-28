import { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "../../../../sanity-client";
import {
  MockDataFaktum,
  MockDataGeneratorFaktum,
  MockDataSeksjon,
  MockDataValgFaktum,
  mockSeksjoner,
} from "../../../soknad-fakta/soknad";
import {
  createSanityAnswerFromApiAnswerOption,
  createSanityBaseFaktumFromApiFaktum,
  createSanityGeneratorFromApiFaktum,
  createSanitySeksjonFromApiSeksjon,
  createSanityValgFaktumFromApiFaktum,
  SubFaktum,
} from "../../../sanity/utils";
import { isGeneratorFaktum, isValgFaktum } from "../../../types/types";
import { SanityBaseDocument } from "../../../sanity/types";

const updateSanity = async (req: NextApiRequest, res: NextApiResponse) => {
  const quizSeksjoner: MockDataSeksjon[] = mockSeksjoner;

  let documents: SanityBaseDocument[] = [];
  const seksjoner = quizSeksjoner.map((apiSection) => {
    const faktum = apiSection.faktum.flatMap((apiFaktum) => {
      return createSanityFaktum(apiFaktum);
    });

    documents = [...documents, ...faktum];
    return createSanitySeksjonFromApiSeksjon(apiSection);
  });

  documents = [...documents, ...seksjoner];

  const transaction = sanityClient.transaction();
  documents.forEach((doc) => transaction.createIfNotExists(doc));
  // documents.forEach((doc) => transaction.delete(doc._id));
  const sanityResponse = await transaction.commit();

  return res.status(200).json(sanityResponse);
};

function createValgFaktum(
  faktum: MockDataValgFaktum | SubFaktum<MockDataValgFaktum>
): SanityBaseDocument[] {
  let documents: SanityBaseDocument[] = [];
  documents = [...documents, ...faktum.answerOptions.map(createSanityAnswerFromApiAnswerOption)];

  if (faktum.subFaktum) {
    documents = [...documents, ...faktum.subFaktum.flatMap(createSanityFaktum)];
  }
  documents = [...documents, createSanityValgFaktumFromApiFaktum(faktum)];

  return documents;
}

function createGeneratorFaktum(faktum: MockDataGeneratorFaktum): SanityBaseDocument[] {
  let documents: SanityBaseDocument[] = [];

  documents = [...documents, ...faktum.faktum.flatMap(createSanityFaktum)];
  documents = [...documents, createSanityGeneratorFromApiFaktum(faktum)];

  return documents;
}

function createSanityFaktum(faktum: MockDataFaktum): SanityBaseDocument[] {
  let documents: SanityBaseDocument[] = [];
  if (isValgFaktum(faktum)) {
    documents = [...documents, ...createValgFaktum(faktum)];
  } else if (isGeneratorFaktum(faktum)) {
    documents = [...documents, ...createGeneratorFaktum(faktum)];
  } else {
    documents = [...documents, createSanityBaseFaktumFromApiFaktum(faktum)];
  }

  return documents;
}

export default updateSanity;
