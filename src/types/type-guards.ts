import {
  QuizFaktum,
  QuizFaktumSvarType,
  IQuizFlervalgFaktum,
  IQuizGeneratorFaktum,
  IQuizPeriodeFaktumAnswerType,
  IQuizEnvalgFaktum,
} from "./quiz.types";

export type SubFaktum<T> = T & {
  requiredAnswerIds: string[];
};

export function isValgFaktum(faktum: QuizFaktum): faktum is IQuizEnvalgFaktum {
  return ["envalg", "boolean"].includes(faktum.type) ?? (faktum as IQuizEnvalgFaktum);
}

export function isFlervalgFaktum(faktum: QuizFaktum): faktum is IQuizFlervalgFaktum {
  return faktum.type === "flervalg" ?? (faktum as IQuizFlervalgFaktum);
}

export function isSubFaktum<T>(faktum: T): faktum is SubFaktum<T> {
  return (faktum as SubFaktum<T>).requiredAnswerIds !== undefined;
}

export function isGeneratorFaktum(
  faktum: QuizFaktum | IQuizGeneratorFaktum
): faktum is IQuizGeneratorFaktum {
  return faktum.type === "generator" ?? (faktum as IQuizGeneratorFaktum);
}

export function isPeriodeAnswer(value: QuizFaktumSvarType): value is IQuizPeriodeFaktumAnswerType {
  return (value as IQuizPeriodeFaktumAnswerType).tom !== undefined;
}
