import { PayloadAction } from "@reduxjs/toolkit";
import { Answer, AnswerType } from "./answers.slice";

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

export function mapReduxAnswerToQuizAnswer(answer: Answer): QuizAnswer {
  return {
    id: answer.id,
    beskrivendeId: answer.beskrivendeId,
    type: answer.type,
    svar: answer.answer,
  };
}
