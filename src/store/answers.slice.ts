import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import api from "../api.utils";
import { FaktumType } from "../types/faktum.types";

export type AnswerType = string | string[] | number | boolean | AnswerPeriode | undefined;
export interface AnswerPeriode {
  fromDate: string;
  toDate: string;
}

export interface Answer {
  id: string;
  beskrivendeId: string;
  type: FaktumType;
  answer: AnswerType;
  // loading: boolean;
  // errorMessages: string[];
}

export const saveAnswerToQuiz = createAsyncThunk<Answer, Answer, { state: RootState }>(
  "answers/setAnswer",
  async (answer: Answer, thunkApi) => {
    const { soknadId, quizFakta } = thunkApi.getState();
    const quizFaktum = quizFakta.find((faktum) => faktum.beskrivendeId === answer.beskrivendeId);

    if (!quizFaktum) {
      return Promise.reject("Ney");
    }

    const quizAnswer = {
      id: quizFaktum.id,
      beskrivendeId: answer.beskrivendeId,
      type: answer.type,
      svar: answer.answer,
    };

    const response: Response = await fetch(api(`/soknad/${soknadId}/faktum/${quizFaktum?.id}`), {
      method: "PUT",
      body: JSON.stringify(quizAnswer),
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
    builder.addCase(saveAnswerToQuiz.pending, (state, action) => {
      const existingIndex = state.findIndex(
        (answer) => answer.beskrivendeId === action.meta.arg.beskrivendeId
      );

      let answer = action.meta.arg.answer;

      // Because quiz returns boolean faktum answers as booleans we need to map back to descriptive answer ids (facepalm)
      if (action.meta.arg.type === "boolean") {
        answer = `${action.meta.arg.beskrivendeId}.svar.${action.meta.arg.answer ? "ja" : "nei"}`;
      }

      if (existingIndex === -1) {
        state.push({
          ...action.meta.arg,
          answer,
          // loading: true,
          // errorMessages: []
        });
      } else {
        state[existingIndex] = {
          ...action.meta.arg,
          answer,
          // loading: true,
          // errorMessages: []
        };
      }
    });

    builder.addCase(saveAnswerToQuiz.fulfilled, (state, action) => {
      const existingIndex = state.findIndex(
        (answer) => answer.beskrivendeId === action.payload.beskrivendeId
      );
      if (existingIndex === -1) {
        state.push({
          ...action.payload,
          // loading: false,
          // errorMessages: []
        });
      } else {
        state[existingIndex] = {
          ...action.payload,
          // loading: false,
          // errorMessages: []
        };
      }
    });

    builder.addCase(saveAnswerToQuiz.rejected, (state, action) => {
      const existingIndex = state.findIndex(
        (answer) => answer.beskrivendeId === action.meta.arg.beskrivendeId
      );
      if (existingIndex === -1) {
        state.push({
          ...action.meta.arg,
          // loading: false,
          // errorMessages: ["Feil i quiz"]
        });
      } else {
        state[existingIndex] = {
          ...action.meta.arg,
          answer: undefined,
          // loading: false,
          // errorMessages: ["Feil i quiz"],
        };
      }
    });
  },
});
