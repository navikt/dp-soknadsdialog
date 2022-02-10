import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface AnswerPeriode {
  fromDate: Date;
  toDate: Date;
}
export type AnswerType = string | string[] | number | Date | AnswerPeriode;
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
