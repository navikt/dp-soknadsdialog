import { configureStore, combineReducers } from "@reduxjs/toolkit";
import seksjonerReducer from "./seksjoner/seksjoner.slice";

const reducer = combineReducers({ soknad: seksjonerReducer });

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
