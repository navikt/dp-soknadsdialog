import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

export type AnswerType = string | Date | string[] | number;
interface Answer {
  faktumId: string;
  answer: AnswerType;
}
interface AnswerState {
  [faktumId: string]: AnswerType;
}

export const answersSlice = createSlice({
  name: "answers",
  initialState: {},
  reducers: {
    setAnswer: (state: AnswerState, action: PayloadAction<Answer>) => {
      state[action.payload.faktumId] = action.payload.answer;
      return state;
    },
  },
});

export const { setAnswer } = answersSlice.actions;

export function selectAllAnswers(state: RootState) {
  return state.answers;
}

export function selectAnswerById(state: RootState, faktumKey: string) {
  return createSelector(selectAllAnswers, (answers: AnswerState) => answers[faktumKey]);
}
