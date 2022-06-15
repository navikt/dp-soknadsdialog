import {
  QuizFaktum,
  QuizFaktumSvarType,
  QuizFlervalgFaktum,
  QuizGeneratorFaktum,
  QuizPeriodeFaktumAnswerType,
  QuizEnvalgFaktum,
} from "./quiz.types";

export type SubFaktum<T> = T & {
  requiredAnswerIds: string[];
};

export function isValgFaktum(faktum: QuizFaktum): faktum is QuizEnvalgFaktum {
  return ["envalg", "boolean"].includes(faktum.type) ?? (faktum as QuizEnvalgFaktum);
}

export function isFlervalgFaktum(faktum: QuizFaktum): faktum is QuizFlervalgFaktum {
  return faktum.type === "flervalg" ?? (faktum as QuizFlervalgFaktum);
}

export function isSubFaktum<T>(faktum: T): faktum is SubFaktum<T> {
  return (faktum as SubFaktum<T>).requiredAnswerIds !== undefined;
}

export function isGeneratorFaktum(
  faktum: QuizFaktum | QuizGeneratorFaktum
): faktum is QuizGeneratorFaktum {
  return faktum.type === "generator" ?? (faktum as QuizGeneratorFaktum);
}

export function isPeriodeAnswer(value: QuizFaktumSvarType): value is QuizPeriodeFaktumAnswerType {
  return (value as QuizPeriodeFaktumAnswerType).tom !== undefined;
}
