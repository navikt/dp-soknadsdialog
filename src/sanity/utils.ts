import { ApiAnswer, ApiFaktum, ApiSeksjon, ApiSubFaktum } from "../pages/api/mock/mock-data";
import { Answer, Faktum, SanityRef, Seksjon, SubFaktum, TextKeyValuePair } from "./types";

export function createSanityAnswerFromApiAnswer(answer: ApiAnswer): Answer {
  return {
    _id: answer.id,
    _type: "answer",
    text: createEmptyKeyValuePair(`${answer.id}.text`),
    alertText: createEmptyKeyValuePair(`${answer.id}.alertText`),
  };
}

export function createSanitySubFaktumFromApiFaktum(
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

export function createSanityFaktumFromApiFaktum(faktum: ApiFaktum, sanityAnswer: Answer[]): Faktum {
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

export function createSanitySeksjonFromApiSeksjon(seksjon: ApiSeksjon, faktum: Faktum[]): Seksjon {
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
