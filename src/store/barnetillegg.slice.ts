import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./index";
import {
  deleteGeneratorStateFromQuiz,
  GeneratorFaktumPayload,
  GeneratorState,
  saveGeneratorFaktumReducer,
  saveGeneratorStateToQuiz,
} from "./generator-utils";
import { FAKTUM_BARNETILLEGG } from "../constants";

const initialState: GeneratorState = {
  id: "",
  beskrivendeId: FAKTUM_BARNETILLEGG,
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
    return await saveGeneratorStateToQuiz(
      soknadId,
      quizFakta,
      barnetillegg,
      FAKTUM_BARNETILLEGG,
      barnetileggPayload
    );
  }
);

export const deleteBarnetilleggFromQuiz = createAsyncThunk<number, number, { state: RootState }>(
  "barnetillegg/deleteBarnetillegg",
  async (deleteIndex: number, thunkApi) => {
    const { soknadId, quizFakta, barnetillegg } = thunkApi.getState();
    return await deleteGeneratorStateFromQuiz(
      soknadId,
      quizFakta,
      barnetillegg,
      FAKTUM_BARNETILLEGG,
      deleteIndex
    );
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
