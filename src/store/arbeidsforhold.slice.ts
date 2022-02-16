import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Answer } from "./answers.slice";

interface ArbeidsforholdPayload {
  arbeidsforhold: IGeneratorAnswer;
  index?: number;
}

export interface IGeneratorAnswer {
  answers: Answer[];
}

interface ArbeidsforholdState {
  id: string;
  beskrivendeId: string;
  type: "generator";
  answers: IGeneratorAnswer[];
}

const initialState: ArbeidsforholdState = {
  id: "",
  beskrivendeId: "faktum.arbeidsforhold",
  type: "generator",
  answers: [],
};
export const arbeidsforholdSlice = createSlice({
  name: "arbeidsforhold",
  initialState,
  reducers: {
    saveArbeidsforhold: (
      state: ArbeidsforholdState,
      action: PayloadAction<ArbeidsforholdPayload>
    ) => {
      if (action.payload.index !== undefined) {
        state.answers[action.payload.index] = action.payload.arbeidsforhold;
      } else {
        state.answers.push(action.payload.arbeidsforhold);
      }
      return state;
    },
    deleteArbeidsforhold: (
      state: ArbeidsforholdState,
      action: PayloadAction<number | undefined>
    ) => {
      if (action.payload !== undefined) {
        state.answers.splice(action.payload, 1);
      }
      return state;
    },
  },
});

export const { saveArbeidsforhold } = arbeidsforholdSlice.actions;
export const { deleteArbeidsforhold } = arbeidsforholdSlice.actions;
