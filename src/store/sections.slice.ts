import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { ISection } from "../types/section.types";

export const sectionsSlice = createSlice({
  name: "sections",
  initialState: [] as ISection[],
  reducers: {
    setSections: (state: ISection[], action: PayloadAction<ISection[]>) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setSections } = sectionsSlice.actions;

export function selectSeksjoner(state: RootState) {
  return state.sections;
}
