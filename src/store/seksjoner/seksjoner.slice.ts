import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import { Quiz } from "../../models/quiz";


interface SeksjonerState {
  seksjoner: Quiz.Seksjon[];
}

const initialState: SeksjonerState = {
  seksjoner: []
};

export const seksjonerSlice = createSlice({
  name: "seksjoner",
  initialState,
  reducers: {
    hent: (state) => { },
    hentFullført: (state) => {},
    hentFeilet: (state) => { }
  }
});

export const seksjonActions = seksjonerSlice.actions;

export const selectSeksjoner = (state: RootState) => state.soknad.seksjoner;

export default seksjonerSlice.reducer;
