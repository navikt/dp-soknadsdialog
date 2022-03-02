import { combineReducers, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { Answer, answersSlice } from "./answers.slice";
import { sectionsSlice } from "./sections.slice";
import { arbeidsforholdSlice } from "./arbeidsforhold.slice";
import { barnetilleggSlice } from "./barnetillegg.slice";
import { soknadIdSlice } from "./soknadId.slice";
import { ISection } from "../types/section.types";
import { QuizFaktum } from "../types/quiz.types";
import { quizFaktaSlice } from "./quizfakta.slice";
import { faktaStateSlice } from "./faktaState.slice";
import { GeneratorState } from "./generator-utils";

const reducer = combineReducers({
  soknadId: soknadIdSlice.reducer,
  sections: sectionsSlice.reducer,
  answers: answersSlice.reducer,
  arbeidsforhold: arbeidsforholdSlice.reducer,
  barnetillegg: barnetilleggSlice.reducer,
  quizFakta: quizFaktaSlice.reducer,
  faktaState: faktaStateSlice.reducer,
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
    reducer,
    devTools: {
      name,
    },
    preloadedState: initialState,
  });
}

export interface RootState {
  soknadId: string;
  sections: ISection[];
  answers: Answer[];
  arbeidsforhold: GeneratorState;
  barnetillegg: GeneratorState;
  quizFakta: QuizFaktum[];
}
