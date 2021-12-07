import { NextApiRequest, NextApiResponse } from "next";
import { ApiAnswer, ApiFaktum, ApiSeksjon, ApiSubFaktum } from "../../../../__mocks__/mock-data";
import { sanityClient } from "../../../../sanity-client";
import {
  Answer,
  Faktum,
  SanityRef,
  Seksjon,
  SubFaktum,
  TextKeyValuePair,
} from "../../../sanity/types";

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

function createSanityAnswerFromApiAnswer(answer: ApiAnswer): Answer {
  return {
    _id: answer.id,
    _type: "answer",
    text: createEmptyKeyValuePair(`${answer.id}.text`),
    alertText: createEmptyKeyValuePair(`${answer.id}.alertText`),
  };
}

function createSanitySubFaktumFromApiFaktum(
  faktum: ApiSubFaktum,
  sanityAnswer: Answer[]
): SubFaktum {
  return {
    _id: faktum.id,
    _type: "subFaktum",
    type: faktum.type,
    requiredAnswerId: faktum.requiredAnswerId,
    title: createEmptyKeyValuePair(`${faktum.id}.title`),
    helpText: createEmptyKeyValuePair(`${faktum.id}.helpText`),
    alertText: createEmptyKeyValuePair(`${faktum.id}.alertText`),
    description: createEmptyKeyValuePair(`${faktum.id}.description`),
    answers: sanityAnswer.map((answer) => createSanityRef(answer._id)),
  };
}

function createSanityFaktumFromApiFaktum(faktum: ApiFaktum, sanityAnswer: Answer[]): Faktum {
  return {
    _id: faktum.id,
    _type: "faktum",
    type: faktum.type,
    title: createEmptyKeyValuePair(`${faktum.id}.title`),
    helpText: createEmptyKeyValuePair(`${faktum.id}.helpText`),
    alertText: createEmptyKeyValuePair(`${faktum.id}.alertText`),
    description: createEmptyKeyValuePair(`${faktum.id}.description`),
    answers: sanityAnswer.map((answer) => createSanityRef(answer._id)),
    subFaktum: faktum.subFaktum.map((subFaktum) => createSanityRef(subFaktum.id)),
  };
}

function createSanitySeksjonFromApiSeksjon(seksjon: ApiSeksjon, faktum: Faktum[]): Seksjon {
  return {
    _id: seksjon.id,
    _type: "seksjon",
    title: createEmptyKeyValuePair(`${seksjon.id}.title`),
    helpText: createEmptyKeyValuePair(`${seksjon.id}.helpText`),
    description: createEmptyKeyValuePair(`${seksjon.id}.description`),
    faktum: faktum.map((faktum) => createSanityRef(faktum._id)),
  };
}

function createEmptyKeyValuePair(key: string): TextKeyValuePair {
  return { key, value: key };
}

function createSanityRef<T>(id: string, key = id): SanityRef<T> {
  return { _ref: id, _type: "reference", _key: key };
}
