import {
  QuizFaktumAnswerPayload,
  QuizFaktumAnswerType,
  QuizGeneratorFaktum,
} from "../types/quiz.types";

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

export interface Answer {
  id: string;
  textId: string;
  type: string;
  value: QuizFaktumAnswerType;
}

export function mapGeneratorReduxAnswerToQuizAnswer(
  answer: Answer,
  quizFaktum: QuizGeneratorFaktum
): QuizFaktumAnswerPayload {
  const quizId = quizFaktum.templates.find((template) => {
    return template.beskrivendeId === answer.textId;
  })?.id;

  if (!quizId) {
    // TODO sentry
    // eslint-disable-next-line no-console
    console.error(`Fant ikke quiz ID for ${answer.textId}, kan ikke lagre faktum i generator`);
  }
  return {
    id: quizId || answer.id,
    beskrivendeId: answer.textId,
    type: answer.type,
    svar: answer.value,
  };
}
