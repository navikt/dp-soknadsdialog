import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GeneratorState, IGeneratorAnswer } from "./arbeidsforhold.slice";

interface BarnetilleggPayload {
  barnetillegg: IGeneratorAnswer;
  index?: number;
}

const initialState: GeneratorState = {
  id: "",
  beskrivendeId: "faktum.barn-liste",
  type: "generator",
  answers: [],
};

export const barnetilleggSlice = createSlice({
  name: "barnetillegg",
  initialState: initialState,
  reducers: {
    saveBarnetillegg: (state: GeneratorState, action: PayloadAction<BarnetilleggPayload>) => {
      if (action.payload.index !== undefined) {
        state.answers[action.payload.index] = action.payload.barnetillegg;
      } else {
        state.answers.push(action.payload.barnetillegg);
      }
      return state;
    },
    deleteBarnetillegg: (state: GeneratorState, action: PayloadAction<number | undefined>) => {
      if (action.payload !== undefined) {
        state.answers.splice(action.payload, 1);
      }
      return state;
    },
  },
});

export const { saveBarnetillegg } = barnetilleggSlice.actions;
export const { deleteBarnetillegg } = barnetilleggSlice.actions;
