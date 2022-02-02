import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

interface SeksjonerState {
  seksjoner: never[];
}

const initialState: SeksjonerState = {
  seksjoner: [],
};

export const seksjonerSlice = createSlice({
  name: "seksjoner",
  initialState,
  reducers: {
    get: () => undefined,
  },
});

export function selectSeksjoner(state: RootState) {
  return state.soknad.seksjoner;
}
