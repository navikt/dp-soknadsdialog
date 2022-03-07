import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./index";
import {
  DeleteGeneratorPayload,
  GeneratorState,
  mapReduxAnswerToQuizAnswer,
  QuizAnswer,
  SaveGeneratorPayload,
} from "./generator-utils";
import { QuizGeneratorFaktum } from "../types/quiz.types";
import api from "../api.utils";

const initialState: GeneratorState[] = [];

export const saveGeneratorStateToQuiz = createAsyncThunk<
  SaveGeneratorPayload,
  SaveGeneratorPayload,
  { state: RootState }
>("generators/saveGeneratorToQuiz", async (payload: SaveGeneratorPayload, thunkApi) => {
  const { soknadId, quizFakta, generators } = thunkApi.getState();
  const quizFaktum = quizFakta.find((faktum) => faktum.beskrivendeId === payload.beskrivendeId) as
    | QuizGeneratorFaktum
    | undefined;

  const generator = generators.find(
    (generator) => generator.beskrivendeId === payload.beskrivendeId
  );

  if (!quizFaktum) {
    // TODO Sentry
    return Promise.reject(`Fant ikke faktum ${payload.beskrivendeId} i quizFaktum i redux state.`);
  }

  let answersInQuizFormat: QuizAnswer[][] = [];

  if (generator) {
    answersInQuizFormat = generator.answers.map((answer) =>
      answer.answers.map((answer) => mapReduxAnswerToQuizAnswer(answer, quizFaktum))
    );
  }

  answersInQuizFormat[payload.index] = payload.answers.map((answer) =>
    mapReduxAnswerToQuizAnswer(answer, quizFaktum)
  );

  const response: Response = await fetch(api(`/soknad/${soknadId}/faktum/${quizFaktum.id}`), {
    method: "PUT",
    body: JSON.stringify({
      id: quizFaktum.id,
      beskrivendeId: payload.beskrivendeId,
      type: "generator",
      svar: answersInQuizFormat,
    }),
  });

  if (response.ok) {
    return Promise.resolve(payload);
  }

  // TODO Sentry
  return Promise.reject(`Klarte ikke å lagre generator state for ${payload.beskrivendeId} i quiz`);
});

export const deleteGeneratorFromQuiz = createAsyncThunk<
  DeleteGeneratorPayload,
  DeleteGeneratorPayload,
  { state: RootState }
>("generators/deleteGeneratorFromQuiz", async (payload: DeleteGeneratorPayload, thunkApi) => {
  const { soknadId, quizFakta, generators } = thunkApi.getState();
  const quizFaktum = quizFakta.find((faktum) => faktum.beskrivendeId === payload.beskrivendeId) as
    | QuizGeneratorFaktum
    | undefined;

  const generator = generators.find(
    (generator) => generator.beskrivendeId === payload.beskrivendeId
  );

  if (!quizFaktum) {
    // TODO Sentry
    return Promise.reject("Ney");
  }

  let answersInQuizFormat: QuizAnswer[][] = [];

  if (generator) {
    answersInQuizFormat = generator.answers.map((answer) =>
      answer.answers.map((answer) => mapReduxAnswerToQuizAnswer(answer, quizFaktum))
    );
  }

  answersInQuizFormat.splice(payload.index, 1);

  const response: Response = await fetch(api(`/soknad/${soknadId}/faktum/${quizFaktum.id}`), {
    method: "PUT",
    body: JSON.stringify({
      id: quizFaktum.id,
      beskrivendeId: payload.beskrivendeId,
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
        (generator) => generator.beskrivendeId === action.payload.beskrivendeId
      );

      if (existingGeneratorIndex === -1) {
        state.push({
          id: "string",
          beskrivendeId: action.payload.beskrivendeId,
          type: "generator",
          answers: [{ answers: action.payload.answers }],
        });
      } else {
        if (state[existingGeneratorIndex].answers[action.payload.index]?.answers) {
          state[existingGeneratorIndex].answers[action.payload.index].answers = newAnswers;
        } else {
          state[existingGeneratorIndex].answers.push({ answers: newAnswers });
        }
      }
    });

    builder.addCase(deleteGeneratorFromQuiz.fulfilled, (state, action) => {
      const existingGeneratorIndex = state.findIndex(
        (generator) => generator.beskrivendeId === action.payload.beskrivendeId
      );

      if (existingGeneratorIndex !== -1) {
        state[existingGeneratorIndex].answers.splice(action.payload.index, 1);
      }
    });
  },
});
