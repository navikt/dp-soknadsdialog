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
  BlueprintAnswerOption,
  BlueprintBaseFaktum,
  BlueprintGeneratorFaktum,
  BlueprintSeksjon,
  BlueprintValgFaktum,
} from "../soknad-fakta/soknad";
import { isSubFaktum } from "./type-guards";

export function createSanityAnswerFromApiAnswerOption(
  answer: BlueprintAnswerOption
): SanityAnswerOption {
  return {
    _id: answer.id,
    _type: "answerOption",
    key: answer.id,
  };
}

export function createSanityGeneratorFromApiFaktum(
  faktum: BlueprintGeneratorFaktum | SubFaktum<BlueprintGeneratorFaktum>
): SanityGeneratorFaktum {
  return {
    _id: faktum.id,
    _type: "generatorFaktum",
    key: faktum.id,
    type: faktum.type,
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
  faktum: BlueprintValgFaktum | SubFaktum<BlueprintValgFaktum>
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
  faktum: BlueprintBaseFaktum | SubFaktum<BlueprintBaseFaktum>
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

export function createSanitySeksjonFromApiSeksjon(seksjon: BlueprintSeksjon): SanitySeksjon {
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
