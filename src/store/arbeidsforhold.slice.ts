import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Answer } from "./answers.slice";

interface ArbeidsforholdPayload {
  arbeidsforhold: IGeneratorAnswers;
  index?: number;
}

export interface IGeneratorAnswers {
  answers: Answer[];
}

export const arbeidsforholdSlice = createSlice({
  name: "arbeidsforhold",
  initialState: [] as IGeneratorAnswers[],
  reducers: {
    saveArbeidsforhold: (
      state: IGeneratorAnswers[],
      action: PayloadAction<ArbeidsforholdPayload>
    ) => {
      if (action.payload.index !== undefined) {
        state[action.payload.index] = action.payload.arbeidsforhold;
      } else {
        state.push(action.payload.arbeidsforhold);
      }
      return state;
    },
    deleteArbeidsforhold: (
      state: IGeneratorAnswers[],
      action: PayloadAction<number | undefined>
    ) => {
      if (action.payload !== undefined) {
        state.splice(action.payload, 1);
      }
      return state;
    },
  },
});

export const { saveArbeidsforhold } = arbeidsforholdSlice.actions;
export const { deleteArbeidsforhold } = arbeidsforholdSlice.actions;
