import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import api from "../api.utils";
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

export const saveAnswerToQuiz = createAsyncThunk<Answer, Answer, { state: RootState }>(
  "answers/setAnswer",
  async (answer: Answer, thunkApi) => {
    const { soknadId, quizFakta } = thunkApi.getState();
    const quizFaktum = quizFakta.find((faktum) => faktum.beskrivendeId === answer.beskrivendeId);

    if (!quizFaktum) {
      return Promise.reject("Ney");
    }

    const response: Response = await fetch(api(`/soknad/${soknadId}/faktum/${quizFaktum?.id}`), {
      method: "PUT",
      body: JSON.stringify(answer),
    });

    if (response.ok) {
      return Promise.resolve(answer);
    }

    return Promise.reject();
  }
);

export const answersSlice = createSlice({
  name: "answers",
  initialState: [] as Answer[],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(saveAnswerToQuiz.fulfilled, (state, action) => {
      const existingIndex = state.findIndex(
        (answer) => answer.beskrivendeId === action.payload.beskrivendeId
      );
      if (existingIndex === -1) {
        state.push(action.payload);
      } else {
        state[existingIndex] = action.payload;
      }
    });
  },
});
