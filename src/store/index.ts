import { combineReducers, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { Answer, answersSlice } from "./answers.slice";
import { sectionsSlice, SectionsState } from "./sections.slice";
import { soknadIdSlice } from "./soknadId.slice";
import { QuizFaktum } from "../types/quiz.types";
import { quizFaktaSlice } from "./quizfakta.slice";
import { GeneratorState } from "./generator-utils";
import { generatorsSlice } from "./generators.slice";
import { navigationSlice, NavigationState } from "./navigation.slice";

export const combinedRootReducer = combineReducers({
  soknadId: soknadIdSlice.reducer,
  sectionsState: sectionsSlice.reducer,
  answers: answersSlice.reducer,
  quizFakta: quizFaktaSlice.reducer,
  generators: generatorsSlice.reducer,
  navigation: navigationSlice.reducer,
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
  answers: Answer[];
  quizFakta: QuizFaktum[];
  generators: GeneratorState[];
  navigation: NavigationState;
}
