import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./index";
import api from "../api.utils";
import {
  GeneratorFaktumPayload,
  GeneratorState,
  mapReduxAnswerToQuizAnswer,
  QuizAnswer,
  saveGeneratorFaktumReducer,
} from "./generator-utils";

const initialState: GeneratorState = {
  id: "",
  beskrivendeId: "faktum.arbeidsforhold",
  type: "generator",
  answers: [],
};

export const saveArbeidsforholdToQuiz = createAsyncThunk<
  GeneratorFaktumPayload,
  GeneratorFaktumPayload,
  { state: RootState }
>(
  "arbeidsforhold/saveArbeidsforholdToQuiz",
  async (arbeidsforholdPayload: GeneratorFaktumPayload, thunkApi) => {
    const { soknadId, quizFakta, arbeidsforhold } = thunkApi.getState();
    const quizFaktum = quizFakta.find((faktum) => faktum.beskrivendeId === "faktum.arbeidsforhold");

    if (!quizFaktum) {
      // TODO Sentry
      return Promise.reject("Ney");
    }

    const answersInQuizFormat: QuizAnswer[][] = arbeidsforhold.answers.map((answers) =>
      answers.answers.map(mapReduxAnswerToQuizAnswer)
    );
    answersInQuizFormat[arbeidsforholdPayload.index] = arbeidsforholdPayload.answers.map(
      mapReduxAnswerToQuizAnswer
    );

    const response: Response = await fetch(api(`/soknad/${soknadId}/faktum/${quizFaktum.id}`), {
      method: "PUT",
      body: JSON.stringify({
        id: quizFaktum.id,
        beskrivendeId: "faktum.arbeidsforhold",
        type: "generator",
        svar: answersInQuizFormat,
      }),
    });

    if (response.ok) {
      return Promise.resolve(arbeidsforholdPayload);
    }

    // TODO Sentry
    return Promise.reject();
  }
);

export const deleteArbeidsforholdFromQuiz = createAsyncThunk<number, number, { state: RootState }>(
  "arbeidsforhold/deleteArbeidsforhold",
  async (index: number, thunkApi) => {
    const { soknadId, quizFakta, arbeidsforhold } = thunkApi.getState();
    const quizFaktum = quizFakta.find((faktum) => faktum.beskrivendeId === "faktum.arbeidsforhold");

    if (!quizFaktum) {
      // TODO Sentry
      return Promise.reject("Ney");
    }

    const answersInQuizFormat: QuizAnswer[][] = arbeidsforhold.answers.map((answers) =>
      answers.answers.map(mapReduxAnswerToQuizAnswer)
    );
    answersInQuizFormat.splice(index, 1);

    const response: Response = await fetch(api(`/soknad/${soknadId}/faktum/${quizFaktum.id}`), {
      method: "PUT",
      body: JSON.stringify({
        id: quizFaktum.id,
        beskrivendeId: "faktum.arbeidsforhold",
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

export const arbeidsforholdSlice = createSlice({
  name: "arbeidsforhold",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(saveArbeidsforholdToQuiz.fulfilled, (state, action) => {
      return saveGeneratorFaktumReducer(state, action);
    });

    builder.addCase(deleteArbeidsforholdFromQuiz.fulfilled, (state, action) => {
      state.answers.splice(action.payload, 1);
    });
  },
});
