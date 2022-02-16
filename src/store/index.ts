import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { answersSlice } from "./answers.slice";
import { seksjonerSlice } from "./seksjoner.slice";
import { arbeidsforholdSlice } from "./arbeidsforhold.slice";
import { barnetilleggSlice } from "./barnetillegg.slice";

const reducer = combineReducers({
  seksjoner: seksjonerSlice.reducer,
  answers: answersSlice.reducer,
  arbeidsforhold: arbeidsforholdSlice.reducer,
  barnetillegg: barnetilleggSlice.reducer,
});

export const store = configureStore({
  reducer,
  devTools: {
    name: "Ny dagpengesøknad",
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
