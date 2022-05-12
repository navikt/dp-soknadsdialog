import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./index";
import {
  Answer,
  DeleteGeneratorPayload,
  GeneratorState,
  mapGeneratorReduxAnswerToQuizAnswer,
} from "./generator-utils";
import { QuizFaktumAnswerPayload, QuizGeneratorFaktum } from "../types/quiz.types";
import api from "../api.utils";

const initialState: GeneratorState[] = [];

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

  let answersInQuizFormat: QuizFaktumAnswerPayload[][] = [];

  const mapToQuizFormat = (answer: Answer) => {
    return mapGeneratorReduxAnswerToQuizAnswer(answer, quizFaktum);
  };

  if (generator) {
    answersInQuizFormat = generator.answers.map((answer) => answer.map(mapToQuizFormat));
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
