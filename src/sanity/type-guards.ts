import { SubFaktum } from "./utils";
import {
  MockDataFaktum,
  MockDataGeneratorFaktum,
  MockDataValgFaktum,
} from "../soknad-fakta/soknad";
import { AnswerPeriod, AnswerValue } from "../store/answers.slice";

export function isMockDataValgFaktum(faktum: MockDataFaktum): faktum is MockDataValgFaktum {
  return (faktum as MockDataValgFaktum).answerOptions !== undefined;
}

export function isSubFaktum<T>(faktum: T): faktum is SubFaktum<T> {
  return (faktum as SubFaktum<T>).requiredAnswerIds !== undefined;
}

export function isGeneratorFaktum(faktum: MockDataFaktum): faktum is MockDataGeneratorFaktum {
  return (faktum as MockDataGeneratorFaktum).faktum !== undefined;
}

export function isPeriodAnswer(value: AnswerValue): value is AnswerPeriod {
  return (value as AnswerPeriod).toDate !== undefined;
}
