import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Answer } from "./answers.slice";

interface ArbeidsforholdPayload {
  arbeidsforhold: IArbeidsforhold;
  index?: number;
}

export interface IArbeidsforhold {
  answers: Answer[];
}

export const arbeidsforholdSlice = createSlice({
  name: "arbeidsforhold",
  initialState: [] as IArbeidsforhold[],
  reducers: {
    saveArbeidsforhold: (
      state: IArbeidsforhold[],
      action: PayloadAction<ArbeidsforholdPayload>
    ) => {
      if (action.payload.index !== undefined) {
        state[action.payload.index] = action.payload.arbeidsforhold;
      } else {
        state.push(action.payload.arbeidsforhold);
      }
      return state;
    },
  },
});

export const { saveArbeidsforhold } = arbeidsforholdSlice.actions;
