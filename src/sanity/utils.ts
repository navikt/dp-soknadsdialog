import {
  MockDataAnswerOption,
  MockDataFaktum,
  MockDataSeksjon,
  MockDataSubFaktum,
} from "../pages/api/mock/mock-data";
import {
  SanityAnswer,
  SanityFaktum,
  SanityRef,
  SanitySeksjon,
  SanitySubFaktum,
  TextKeyValuePair,
} from "./types";
import { nanoid } from "nanoid";

export function createSanityAnswerFromApiAnswer(answer: MockDataAnswerOption): SanityAnswer {
  return {
    _id: answer.id,
    _type: "answer",
    text: createEmptyKeyValuePair(`${answer.id}.text`),
    alertText: createEmptyKeyValuePair(`${answer.id}.alertText`),
  };
}

export function createSanitySubFaktumFromApiFaktum(
  faktum: MockDataSubFaktum,
  sanityAnswer: SanityAnswer[]
): SanitySubFaktum {
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

export function createSanityFaktumFromApiFaktum(
  faktum: MockDataFaktum,
  sanityAnswer: SanityAnswer[]
): SanityFaktum {
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

export function createSanitySeksjonFromApiSeksjon(
  seksjon: MockDataSeksjon,
  faktum: SanityFaktum[]
): SanitySeksjon {
  return {
    _id: seksjon.id,
    _type: "seksjon",
    title: createEmptyKeyValuePair(`${seksjon.id}.title`),
    description: createEmptyKeyValuePair(`${seksjon.id}.description`),
    faktum: faktum.map((faktum) => createSanityRef(faktum._id)),
  };
}

function createEmptyKeyValuePair(key: string): TextKeyValuePair {
  return { key, value: key };
}

function createSanityRef<T>(id: string): SanityRef<T> {
  return { _ref: id, _type: "reference", _key: nanoid() };
}
