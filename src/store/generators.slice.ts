import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./index";
import {
  DeleteGeneratorPayload,
  GeneratorState,
  mapGeneratorReduxAnswerToQuizAnswer,
  SaveGeneratorPayload,
} from "./generator-utils";
import { QuizAnswer, QuizGeneratorFaktum } from "../types/quiz.types";
import api from "../api.utils";

const initialState: GeneratorState[] = [];

export const saveGeneratorStateToQuiz = createAsyncThunk<
  SaveGeneratorPayload,
  SaveGeneratorPayload,
  { state: RootState }
>("generators/saveGeneratorToQuiz", async (payload: SaveGeneratorPayload, thunkApi) => {
  const { soknadId, quizFakta, generators } = thunkApi.getState();
  const quizFaktum = quizFakta.find((faktum) => faktum.beskrivendeId === payload.textId) as
    | QuizGeneratorFaktum
    | undefined;

  const generator = generators.find((generator) => generator.textId === payload.textId);

  if (!quizFaktum) {
    // TODO Sentry
    return Promise.reject(`Fant ikke faktum ${payload.textId} i quizFaktum i redux state.`);
  }

  let answersInQuizFormat: QuizAnswer[][] = [];

  if (generator) {
    answersInQuizFormat = generator.answers.map((answer) =>
      answer.map((answer) => mapGeneratorReduxAnswerToQuizAnswer(answer, quizFaktum))
    );
  }

  answersInQuizFormat[payload.index] = payload.answers.map((answer) =>
    mapGeneratorReduxAnswerToQuizAnswer(answer, quizFaktum)
  );

  const response: Response = await fetch(api(`/soknad/${soknadId}/faktum/${quizFaktum.id}`), {
    method: "PUT",
    body: JSON.stringify({
      id: quizFaktum.id,
      beskrivendeId: payload.textId,
      type: "generator",
      svar: answersInQuizFormat,
    }),
  });

  if (response.ok) {
    return Promise.resolve(payload);
  }

  // TODO Sentry
  return Promise.reject(`Klarte ikke å lagre generator state for ${payload.textId} i quiz`);
});

export const deleteGeneratorFromQuiz = createAsyncThunk<
  DeleteGeneratorPayload,
  DeleteGeneratorPayload,
  { state: RootState }
>("generators/deleteGeneratorFromQuiz", async (payload: DeleteGeneratorPayload, thunkApi) => {
  const { soknadId, quizFakta, generators } = thunkApi.getState();
  const quizFaktum = quizFakta.find((faktum) => faktum.beskrivendeId === payload.textId) as
    | QuizGeneratorFaktum
    | undefined;

  const generator = generators.find((generator) => generator.textId === payload.textId);

  if (!quizFaktum) {
    // TODO Sentry
    return Promise.reject("Ney");
  }

  let answersInQuizFormat: QuizAnswer[][] = [];

  if (generator) {
    answersInQuizFormat = generator.answers.map((answer) =>
      answer.map((answer) => mapGeneratorReduxAnswerToQuizAnswer(answer, quizFaktum))
    );
  }

  answersInQuizFormat.splice(payload.index, 1);

  const response: Response = await fetch(api(`/soknad/${soknadId}/faktum/${quizFaktum.id}`), {
    method: "PUT",
    body: JSON.stringify({
      id: quizFaktum.id,
      beskrivendeId: payload.textId,
      type: "generator",
      svar: answersInQuizFormat,
    }),
  });

  if (response.ok) {
    return Promise.resolve(payload);
  }

  // TODO Sentry
  return Promise.reject();
});

export const generatorsSlice = createSlice({
  name: "generators",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(saveGeneratorStateToQuiz.fulfilled, (state, action) => {
      const newAnswers = action.payload.answers;
      const existingGeneratorIndex = state.findIndex(
        (generator) => generator.textId === action.payload.textId
      );

      if (existingGeneratorIndex === -1) {
        state.push({
          id: "string",
          textId: action.payload.textId,
          type: "generator",
          answers: [action.payload.answers],
        });
      } else {
        if (state[existingGeneratorIndex].answers[action.payload.index]) {
          state[existingGeneratorIndex].answers[action.payload.index] = newAnswers;
        } else {
          state[existingGeneratorIndex].answers.push(newAnswers);
        }
      }
    });

    builder.addCase(deleteGeneratorFromQuiz.fulfilled, (state, action) => {
      const existingGeneratorIndex = state.findIndex(
        (generator) => generator.textId === action.payload.textId
      );

      if (existingGeneratorIndex !== -1) {
        state[existingGeneratorIndex].answers.splice(action.payload.index, 1);
      }
    });
  },
});
