import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { ISeksjon } from "../types/seksjon.types";

export const seksjonerSlice = createSlice({
  name: "seksjoner",
  initialState: [] as ISeksjon[],
  reducers: {
    setSeksjoner: (state: ISeksjon[], action: PayloadAction<ISeksjon[]>) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setSeksjoner } = seksjonerSlice.actions;

export function selectSeksjoner(state: RootState) {
  return state.seksjoner;
}
