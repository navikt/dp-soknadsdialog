import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { answersSlice } from "./answers.slice";
import { seksjonerSlice } from "./seksjoner.slice";

const reducer = combineReducers({
  seksjoner: seksjonerSlice.reducer,
  answers: answersSlice.reducer,
});

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
