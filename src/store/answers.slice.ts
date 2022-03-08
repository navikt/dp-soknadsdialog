import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import api from "../api.utils";
import { FaktumType } from "../types/faktum.types";

export type AnswerValue = string | string[] | number | boolean | AnswerPeriode | undefined;
export interface AnswerPeriode {
  fromDate: string;
  toDate: string;
}

export interface Answer {
  id: string;
  beskrivendeId: string;
  type: FaktumType;
  value: AnswerValue;
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
      svar: answer.value,
    };

    const response: Response = await fetch(api(`/soknad/${soknadId}/faktum/${quizFaktum.id}`), {
      method: "PUT",
      body: JSON.stringify(quizAnswer),
    });

    if (response.ok) {
      return Promise.resolve({ ...answer, id: quizFaktum.id });
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

      let value = action.meta.arg.value;

      // Because quiz returns boolean faktum answers as booleans we need to map back to descriptive answer ids (facepalm)
      if (action.meta.arg.type === "boolean") {
        value = `${action.meta.arg.beskrivendeId}.svar.${action.meta.arg.value ? "ja" : "nei"}`;
      }

      if (existingIndex === -1) {
        state.push({
          ...action.meta.arg,
          value,
          // loading: true,
          // errorMessages: []
        });
      } else {
        state[existingIndex] = {
          ...action.meta.arg,
          value,
          // loading: true,
          // errorMessages: []
        };
      }
    });

    builder.addCase(saveAnswerToQuiz.fulfilled, (state, action) => {
      const existingIndex = state.findIndex(
        (answer) => answer.beskrivendeId === action.payload.beskrivendeId
      );

      let value = action.meta.arg.value;

      // Because quiz returns boolean faktum answers as booleans we need to map back to descriptive answer ids (facepalm)
      if (action.meta.arg.type === "boolean") {
        value = `${action.meta.arg.beskrivendeId}.svar.${action.meta.arg.value ? "ja" : "nei"}`;
      }

      if (existingIndex === -1) {
        state.push({
          ...action.payload,
          value,
          // loading: false,
          // errorMessages: []
        });
      } else {
        state[existingIndex] = {
          ...action.payload,
          value,
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
          value: undefined,
          // loading: false,
          // errorMessages: ["Feil i quiz"]
        });
      } else {
        state[existingIndex] = {
          ...action.meta.arg,
          value: undefined,
          // loading: false,
          // errorMessages: ["Feil i quiz"],
        };
      }
    });
  },
});
