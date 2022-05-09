import { AnswerPeriod, AnswerValue } from "../store/answers.slice";
import { IFaktum, IGeneratorFaktum, IValgFaktum } from "../types/faktum.types";

export type SubFaktum<T> = T & {
  requiredAnswerIds: string[];
};

export function isValgFaktum(faktum: IFaktum): faktum is IValgFaktum {
  return ["flervalg", "envalg", "boolean"].includes(faktum.type) ?? (faktum as IValgFaktum);
}

export function isSubFaktum<T>(faktum: T): faktum is SubFaktum<T> {
  return (faktum as SubFaktum<T>).requiredAnswerIds !== undefined;
}

export function isGeneratorFaktum(faktum: IFaktum): faktum is IGeneratorFaktum {
  return (
    (faktum as IGeneratorFaktum).fakta !== null && (faktum as IGeneratorFaktum).fakta !== undefined
  );
}

export function isPeriodAnswer(value: AnswerValue): value is AnswerPeriod {
  return (value as AnswerPeriod).toDate !== undefined;
}
