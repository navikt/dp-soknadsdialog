import { createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";

export const seksjonerSlice = createSlice({
  name: "seksjoner",
  initialState: [],
  reducers: {
    get: () => undefined,
  },
});

export function selectSeksjoner(state: RootState) {
  return state.seksjoner;
}
