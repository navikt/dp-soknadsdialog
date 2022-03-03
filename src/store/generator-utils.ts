import { PayloadAction } from "@reduxjs/toolkit";
import { Answer, AnswerType } from "./answers.slice";
import { QuizGeneratorFaktum } from "../types/quiz.types";

export interface GeneratorFaktumPayload {
  answers: Answer[];
  index: number;
}

export interface IGeneratorAnswer {
  answers: Answer[];
}

export interface GeneratorState {
  id: string;
  beskrivendeId: string;
  type: "generator";
  answers: IGeneratorAnswer[];
}

export interface QuizAnswer {
  id: string;
  beskrivendeId: string;
  type: string;
  svar: AnswerType;
}

export function saveGeneratorFaktumReducer(
  state: GeneratorState,
  action: PayloadAction<GeneratorFaktumPayload>
): GeneratorState {
  if (state.answers[action.payload.index]?.answers) {
    state.answers[action.payload.index].answers = action.payload.answers;
  } else {
    state.answers.push({ answers: action.payload.answers });
  }
  return state;
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
    svar: answer.answer,
  };
}
