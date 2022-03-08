import { Answer, mapReduxAnswerToQuizAnswer } from "./answers.slice";
import { QuizAnswer, QuizGeneratorFaktum } from "../types/quiz.types";

export interface SaveGeneratorPayload {
  index: number;
  answers: Answer[];
  textId: string;
}

export interface DeleteGeneratorPayload {
  index: number;
  textId: string;
}

export interface GeneratorState {
  id: string;
  textId: string;
  type: "generator";
  answers: Answer[][];
}

export function mapGeneratorReduxAnswerToQuizAnswer(
  answer: Answer,
  quizFaktum: QuizGeneratorFaktum
): QuizAnswer {
  const quizId = quizFaktum.templates.find((template) => {
    return template.beskrivendeId === answer.textId;
  })?.id;

  if (!quizId) {
    // TODO sentry
    // eslint-disable-next-line no-console
    console.error(`Fant ikke quiz ID for ${answer.textId}, kan ikke lagre faktum i generator`);
  }

  return mapReduxAnswerToQuizAnswer(answer, quizId || answer.id);
}
