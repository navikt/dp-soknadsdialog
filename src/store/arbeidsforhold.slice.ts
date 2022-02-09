import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Answer } from "./answers.slice";

export interface IArbeidsforhold {
  id: string; //generator faktumid
  name: string; // navn på arbeidshold -> Kan være preutfylt fra quiz
  fromDate: string;
  toDate?: string;
  fakta: Answer[];
}

export const arbeidsforholdSlice = createSlice({
  name: "arbeidsforhold",
  initialState: [] as IArbeidsforhold[],
  reducers: {
    saveArbeidsforhold: (state: IArbeidsforhold[], action: PayloadAction<IArbeidsforhold>) => {
      state.push(action.payload);
      return state;
    },
  },
});

export const { saveArbeidsforhold } = arbeidsforholdSlice.actions;
