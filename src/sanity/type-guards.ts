import { SubFaktum } from "./utils";
import {
  MockDataFaktum,
  MockDataGeneratorFaktum,
  MockDataValgFaktum,
} from "../soknad-fakta/soknad";
import { AnswerPeriod, AnswerValue } from "../store/answers.slice";
import { IFaktum, IGeneratorFaktum, IValgFaktum } from "../types/faktum.types";

export function isMockDataValgFaktum(faktum: MockDataFaktum): faktum is MockDataValgFaktum {
  return (faktum as MockDataValgFaktum).answerOptions !== undefined;
}

export function isValgFaktum(faktum: IFaktum): faktum is IValgFaktum {
  return ["flervalg", "valg", "boolean"].includes(faktum.type) ?? (faktum as IValgFaktum);
}

export function isSubFaktum<T>(faktum: T): faktum is SubFaktum<T> {
  return (faktum as SubFaktum<T>).requiredAnswerIds !== undefined;
}

export function isMockDataGeneratorFaktum(
  faktum: MockDataFaktum
): faktum is MockDataGeneratorFaktum {
  return (faktum as MockDataGeneratorFaktum).faktum !== undefined;
}
export function isGeneratorFaktum(faktum: IFaktum): faktum is IGeneratorFaktum {
  return (faktum as IGeneratorFaktum).faktum !== null;
}

export function isPeriodAnswer(value: AnswerValue): value is AnswerPeriod {
  return (value as AnswerPeriod).toDate !== undefined;
}
