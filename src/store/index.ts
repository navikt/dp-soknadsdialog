import { combineReducers, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { sectionsSlice, SectionsState } from "./sections.slice";
import { soknadIdSlice } from "./soknadId.slice";
import { QuizFaktum } from "../types/quiz.types";
import { quizFaktaSlice } from "./quizfakta.slice";
import { GeneratorState } from "./generator-utils";
import { generatorsSlice } from "./generators.slice";

export const combinedRootReducer = combineReducers({
  soknadId: soknadIdSlice.reducer,
  sectionsState: sectionsSlice.reducer,
  quizFakta: quizFaktaSlice.reducer,
  generators: generatorsSlice.reducer,
});

let store: EnhancedStore;

export const initialiseStore = (preloadedState: RootState) => {
  if (typeof window === "undefined") {
    return createStore(preloadedState, "SSR Store");
  }

  if (!store) {
    store = createStore(preloadedState, "Client-side store");
  }

  return store;
};

function createStore(initialState: RootState, name: string) {
  return configureStore({
    reducer: combinedRootReducer,
    devTools: {
      name,
    },
    preloadedState: initialState,
  });
}

export interface RootState {
  soknadId: string;
  sectionsState: SectionsState;
  quizFakta: QuizFaktum[];
  generators: GeneratorState[];
}
