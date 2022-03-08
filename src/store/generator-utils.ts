import { Answer, AnswerValue } from "./answers.slice";
import { QuizGeneratorFaktum } from "../types/quiz.types";

export interface SaveGeneratorPayload {
  index: number;
  answers: Answer[];
  beskrivendeId: string;
}

export interface DeleteGeneratorPayload {
  index: number;
  beskrivendeId: string;
}

export interface GeneratorState {
  id: string;
  beskrivendeId: string;
  type: "generator";
  answers: Answer[][];
}

export interface QuizAnswer {
  id: string;
  beskrivendeId: string;
  type: string;
  svar: AnswerValue;
}

export function mapReduxAnswerToQuizAnswer(
  answer: Answer,
  quizFaktum: QuizGeneratorFaktum
): QuizAnswer {
  const quizId = quizFaktum.templates.find((template) => {
    return template.beskrivendeId === answer.beskrivendeId;
  })?.id;

  if (!quizId) {
    // TODO sentry
    // eslint-disable-next-line no-console
    console.error(
      `Fant ikke quiz ID for ${answer.beskrivendeId}, kan ikke lagre faktum i generator`
    );
  }

  return {
    id: quizId || answer.id,
    beskrivendeId: answer.beskrivendeId,
    type: answer.type,
    svar: answer.value,
  };
}
