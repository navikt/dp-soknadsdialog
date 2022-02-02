import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { seksjonerSlice } from "./seksjoner/seksjoner.slice";

const reducer = combineReducers({ soknad: seksjonerSlice.reducer });

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
