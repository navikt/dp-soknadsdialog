import { configureStore } from "@reduxjs/toolkit";
import seksjonerReducer from "./seksjoner.slice";

export const store = configureStore({
  reducer: {
    soknad: seksjonerReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
