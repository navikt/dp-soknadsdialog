import { SubFaktum } from "./utils";
import {
  BlueprintFaktum,
  BlueprintGeneratorFaktum,
  BlueprintValgFaktum,
} from "../soknad-fakta/soknad";
import { AnswerPeriod, AnswerValue } from "../store/answers.slice";
import { IFaktum, IGeneratorFaktum, IValgFaktum } from "../types/faktum.types";

export function isBlueprintValgFaktum(faktum: BlueprintFaktum): faktum is BlueprintValgFaktum {
  return (faktum as BlueprintValgFaktum).answerOptions !== undefined;
}

export function isValgFaktum(faktum: IFaktum): faktum is IValgFaktum {
  return ["flervalg", "envalg", "boolean"].includes(faktum.type) ?? (faktum as IValgFaktum);
}

export function isSubFaktum<T>(faktum: T): faktum is SubFaktum<T> {
  return (faktum as SubFaktum<T>).requiredAnswerIds !== undefined;
}

export function isBlueprintGeneratorFaktum(
  faktum: BlueprintFaktum
): faktum is BlueprintGeneratorFaktum {
  return (faktum as BlueprintGeneratorFaktum).faktum !== undefined;
}
export function isGeneratorFaktum(faktum: IFaktum): faktum is IGeneratorFaktum {
  return (
    (faktum as IGeneratorFaktum).faktum !== null &&
    (faktum as IGeneratorFaktum).faktum !== undefined
  );
}

export function isPeriodAnswer(value: AnswerValue): value is AnswerPeriod {
  return (value as AnswerPeriod).toDate !== undefined;
}
