import { nanoid } from "nanoid";
import {
  SanityAnswerOption,
  SanityBaseFaktum,
  SanityGeneratorFaktum,
  SanityRef,
  SanitySeksjon,
  SanityValgFaktum,
} from "./types";
import {
  MockDataAnswerOption,
  MockDataBaseFaktum,
  MockDataGeneratorFaktum,
  MockDataSeksjon,
  MockDataValgFaktum,
} from "../soknad-fakta/soknad";
import { isSubFaktum } from "./type-guards";

export function createSanityAnswerFromApiAnswerOption(
  answer: MockDataAnswerOption
): SanityAnswerOption {
  return {
    _id: answer.id,
    _type: "answerOption",
    key: answer.id,
  };
}

export function createSanityGeneratorFromApiFaktum(
  faktum: MockDataGeneratorFaktum | SubFaktum<MockDataGeneratorFaktum>
): SanityGeneratorFaktum {
  return {
    _id: faktum.id,
    _type: "generatorFaktum",
    key: faktum.id,
    type: faktum.type,
    listType: faktum.listType,
    faktum: faktum.faktum.map((faktum) => createSanityRef(faktum.id)),
    requiredAnswerIds: isSubFaktum(faktum)
      ? faktum.requiredAnswerIds.map((id) => createSanityRef(id))
      : undefined,
  };
}

export type SubFaktum<T> = T & {
  requiredAnswerIds: string[];
};

export function createSanityValgFaktumFromApiFaktum(
  faktum: MockDataValgFaktum | SubFaktum<MockDataValgFaktum>
): SanityValgFaktum {
  return {
    _id: faktum.id,
    _type: "valgFaktum",
    key: faktum.id,
    type: faktum.type,
    answerOptions: faktum.answerOptions.map((answer) => createSanityRef(answer.id)),
    subFaktum: faktum.subFaktum?.map((subFaktum) => createSanityRef(subFaktum.id)) || [],
    requiredAnswerIds: isSubFaktum(faktum)
      ? faktum.requiredAnswerIds.map((id) => createSanityRef(id))
      : undefined,
  };
}

export function createSanityBaseFaktumFromApiFaktum(
  faktum: MockDataBaseFaktum | SubFaktum<MockDataBaseFaktum>
): SanityBaseFaktum {
  return <SanityBaseFaktum>{
    _id: faktum.id,
    _type: "baseFaktum",
    key: faktum.id,
    type: faktum.type,
    requiredAnswerIds: isSubFaktum(faktum)
      ? faktum.requiredAnswerIds.map((id) => createSanityRef(id))
      : undefined,
  };
}

export function createSanitySeksjonFromApiSeksjon(seksjon: MockDataSeksjon): SanitySeksjon {
  return {
    _id: seksjon.id,
    _type: "seksjon",
    key: seksjon.id,
    faktum: seksjon.faktum.map((faktum) => createSanityRef(faktum.id)),
  };
}

function createSanityRef<T>(id: string): SanityRef<T> {
  return { _ref: id, _type: "reference", _key: nanoid() };
}
