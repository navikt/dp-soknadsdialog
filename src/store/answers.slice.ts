import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AnswerType = string | string[] | number | AnswerPeriode;
export interface AnswerPeriode {
  fromDate: string;
  toDate: string;
}

export interface Answer {
  faktumId: string;
  answer: AnswerType;
}

export const answersSlice = createSlice({
  name: "answers",
  initialState: [] as Answer[],
  reducers: {
    setAnswer: (state: Answer[], action: PayloadAction<Answer>) => {
      const existingIndex = state.findIndex(
        (answer) => answer.faktumId === action.payload.faktumId
      );
      if (existingIndex === -1) {
        state.push(action.payload);
      } else {
        state[existingIndex] = action.payload;
      }
      return state;
    },
  },
});

export const { setAnswer } = answersSlice.actions;
