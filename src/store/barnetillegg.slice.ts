import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGeneratorAnswers } from "./arbeidsforhold.slice";

interface BarnetilleggPayload {
  barnetillegg: IGeneratorAnswers;
  index?: number;
}

export const barnetilleggSlice = createSlice({
  name: "barnetillegg",
  initialState: [] as IGeneratorAnswers[],
  reducers: {
    saveBarnetillegg: (state: IGeneratorAnswers[], action: PayloadAction<BarnetilleggPayload>) => {
      if (action.payload.index !== undefined) {
        state[action.payload.index] = action.payload.barnetillegg;
      } else {
        state.push(action.payload.barnetillegg);
      }
      return state;
    },
    deleteBarnetillegg: (state: IGeneratorAnswers[], action: PayloadAction<number | undefined>) => {
      if (action.payload !== undefined) {
        state.splice(action.payload, 1);
      }
      return state;
    },
  },
});

export const { saveBarnetillegg } = barnetilleggSlice.actions;
export const { deleteBarnetillegg } = barnetilleggSlice.actions;
