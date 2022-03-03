import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./index";
import {
  GeneratorFaktumPayload,
  GeneratorState,
  mapReduxAnswerToQuizAnswer,
  QuizAnswer,
  saveGeneratorFaktumReducer,
} from "./generator-utils";
import api from "../api.utils";
import { QuizGeneratorFaktum } from "../types/quiz.types";

const initialState: GeneratorState = {
  id: "",
  beskrivendeId: "faktum.barn-liste",
  type: "generator",
  answers: [],
};

export const saveBarnetileggToQuiz = createAsyncThunk<
  GeneratorFaktumPayload,
  GeneratorFaktumPayload,
  { state: RootState }
>(
  "barnetillegg/saveBarnetileggToQuiz",
  async (barnetileggPayload: GeneratorFaktumPayload, thunkApi) => {
    const { soknadId, quizFakta, barnetillegg } = thunkApi.getState();
    const quizFaktum = quizFakta.find((faktum) => faktum.beskrivendeId === "faktum.barn-liste") as
      | QuizGeneratorFaktum
      | undefined;

    if (!quizFaktum) {
      // TODO Sentry
      return Promise.reject("Ney");
    }

    const answersInQuizFormat: QuizAnswer[][] = barnetillegg.answers.map((answer) =>
      answer.answers.map((answer) => mapReduxAnswerToQuizAnswer(answer, quizFaktum))
    );

    answersInQuizFormat[barnetileggPayload.index] = barnetileggPayload.answers.map((answer) =>
      mapReduxAnswerToQuizAnswer(answer, quizFaktum)
    );

    const response: Response = await fetch(api(`/soknad/${soknadId}/faktum/${quizFaktum.id}`), {
      method: "PUT",
      body: JSON.stringify({
        id: quizFaktum.id,
        beskrivendeId: "faktum.barn-liste",
        type: "generator",
        svar: answersInQuizFormat,
      }),
    });

    if (response.ok) {
      return Promise.resolve(barnetileggPayload);
    }

    // TODO Sentry
    return Promise.reject();
  }
);

export const deleteBarnetilleggFromQuiz = createAsyncThunk<number, number, { state: RootState }>(
  "barnetillegg/deleteBarnetillegg",
  async (index: number, thunkApi) => {
    const { soknadId, quizFakta, barnetillegg } = thunkApi.getState();
    const quizFaktum = quizFakta.find((faktum) => faktum.beskrivendeId === "faktum.barn-liste") as
      | QuizGeneratorFaktum
      | undefined;

    if (!quizFaktum) {
      // TODO Sentry
      return Promise.reject("Ney");
    }

    const answersInQuizFormat: QuizAnswer[][] = barnetillegg.answers.map((answer) =>
      answer.answers.map((answer) => mapReduxAnswerToQuizAnswer(answer, quizFaktum))
    );
    answersInQuizFormat.splice(index, 1);

    const response: Response = await fetch(api(`/soknad/${soknadId}/faktum/${quizFaktum.id}`), {
      method: "PUT",
      body: JSON.stringify({
        id: quizFaktum.id,
        beskrivendeId: "faktum.barn-liste",
        type: "generator",
        svar: answersInQuizFormat,
      }),
    });

    if (response.ok) {
      return Promise.resolve(index);
    }

    // TODO Sentry
    return Promise.reject();
  }
);

export const barnetilleggSlice = createSlice({
  name: "barnetillegg",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(saveBarnetileggToQuiz.fulfilled, (state, action) => {
      return saveGeneratorFaktumReducer(state, action);
    });

    builder.addCase(deleteBarnetilleggFromQuiz.fulfilled, (state, action) => {
      state.answers.splice(action.payload, 1);
    });
  },
});
