import { AnswerPeriod, AnswerValue } from "../store/answers.slice";
import { QuizFaktum, QuizFlervalgFaktum, QuizGeneratorFaktum, QuizValgFaktum } from "./quiz.types";

export type SubFaktum<T> = T & {
  requiredAnswerIds: string[];
};

export function isValgFaktum(faktum: QuizFaktum): faktum is QuizValgFaktum {
  return ["envalg", "boolean"].includes(faktum.type) ?? (faktum as QuizValgFaktum);
}

export function isFlervalgFaktum(faktum: QuizFaktum): faktum is QuizFlervalgFaktum {
  return faktum.type === "flervalg" ?? (faktum as QuizFlervalgFaktum);
}

export function isSubFaktum<T>(faktum: T): faktum is SubFaktum<T> {
  return (faktum as SubFaktum<T>).requiredAnswerIds !== undefined;
}

export function isGeneratorFaktum(faktum: QuizGeneratorFaktum): faktum is QuizGeneratorFaktum {
  return faktum.type === "generator" ?? (faktum as QuizGeneratorFaktum);
}

export function isPeriodAnswer(value: AnswerValue): value is AnswerPeriod {
  return (value as AnswerPeriod).toDate !== undefined;
}
