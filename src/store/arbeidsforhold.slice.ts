import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Answer } from "./answers.slice";
import { RootState } from "./index";
import api from "../api.utils";

interface ArbeidsforholdPayload {
  answers: Answer[];
  index: number;
}

export interface IGeneratorAnswer {
  answers: Answer[];
}

export interface GeneratorState {
  id: string;
  beskrivendeId: string;
  type: "generator";
  answers: IGeneratorAnswer[];
}

const initialState: GeneratorState = {
  id: "",
  beskrivendeId: "faktum.arbeidsforhold",
  type: "generator",
  answers: [],
};

export const saveArbeidsforholdToQuiz = createAsyncThunk<
  ArbeidsforholdPayload,
  ArbeidsforholdPayload,
  { state: RootState }
>(
  "arbeidsforhold/saveArbeidsforhold",
  async (arbeidsforholdPayload: ArbeidsforholdPayload, thunkApi) => {
    const { soknadId, quizFakta, arbeidsforhold } = thunkApi.getState();
    const quizFaktum = quizFakta.find((faktum) => faktum.beskrivendeId === "faktum.arbeidsforhold");

    if (!quizFaktum) {
      // TODO Sentry
      return Promise.reject("Ney");
    }

    const answersInQuizFormat = arbeidsforhold.answers.map((answers) => answers.answers);
    answersInQuizFormat[arbeidsforholdPayload.index] = arbeidsforholdPayload.answers;

    const quizAnswer = {
      beskrivendeId: "faktum.arbeidsforhold",
      type: "generator",
      svar: answersInQuizFormat,
    };

    const response: Response = await fetch(api(`/soknad/${soknadId}/faktum/${quizFaktum.id}`), {
      method: "PUT",
      body: JSON.stringify(quizAnswer),
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

    const answersInQuizFormat = arbeidsforhold.answers.map((answers) => answers.answers);
    answersInQuizFormat.splice(index, 1);

    const quizAnswer = {
      id: quizFaktum.id,
      beskrivendeId: "faktum.arbeidsforhold",
      type: "generator",
      svar: answersInQuizFormat,
    };

    const response: Response = await fetch(api(`/soknad/${soknadId}/faktum/${quizFaktum.id}`), {
      method: "PUT",
      body: JSON.stringify(quizAnswer),
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
      if (state.answers[action.payload.index]?.answers) {
        state.answers[action.payload.index].answers = action.payload.answers;
      } else {
        state.answers.push({ answers: action.payload.answers });
      }
      return state;
    });

    builder.addCase(deleteArbeidsforholdFromQuiz.fulfilled, (state, action) => {
      state.answers.splice(action.payload, 1);
    });
  },
});
