import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FaktumType } from "../types/faktum.types";

export type AnswerType = string | string[] | number | AnswerPeriode;
export interface AnswerPeriode {
  fromDate: string;
  toDate: string;
}

export interface Answer {
  id: string;
  beskrivendeId: string;
  type: FaktumType;
  answer: AnswerType;
}

export const answersSlice = createSlice({
  name: "answers",
  initialState: [] as Answer[],
  reducers: {
    setAnswer: (state: Answer[], action: PayloadAction<Answer>) => {
      const existingIndex = state.findIndex(
        (answer) => answer.beskrivendeId === action.payload.beskrivendeId
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
