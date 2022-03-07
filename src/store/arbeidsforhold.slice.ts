import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./index";
import {
  deleteGeneratorStateFromQuiz,
  GeneratorFaktumPayload,
  GeneratorState,
  saveGeneratorFaktumReducer,
  saveGeneratorStateToQuiz,
} from "./generator-utils";
import { FAKTUM_ARBEIDSFORHOLD } from "../constants";

const initialState: GeneratorState = {
  id: "",
  beskrivendeId: FAKTUM_ARBEIDSFORHOLD,
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
    return await saveGeneratorStateToQuiz(
      soknadId,
      quizFakta,
      arbeidsforhold,
      FAKTUM_ARBEIDSFORHOLD,
      arbeidsforholdPayload
    );
  }
);

export const deleteArbeidsforholdFromQuiz = createAsyncThunk<number, number, { state: RootState }>(
  "arbeidsforhold/deleteArbeidsforhold",
  async (deleteIndex: number, thunkApi) => {
    const { soknadId, quizFakta, arbeidsforhold } = thunkApi.getState();
    return await deleteGeneratorStateFromQuiz(
      soknadId,
      quizFakta,
      arbeidsforhold,
      FAKTUM_ARBEIDSFORHOLD,
      deleteIndex
    );
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
