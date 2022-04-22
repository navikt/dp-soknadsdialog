import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISection } from "../types/section.types";
import { RootState } from "./index";

export interface SectionsState {
  sections: ISection[];
  currentSectionIndex: number;
}

export const initialSectionsState: SectionsState = {
  sections: [],
  currentSectionIndex: 0,
};

export const sectionsSlice = createSlice({
  name: "sections",
  initialState: initialSectionsState,
  reducers: {
    setSections: (state: SectionsState, action: PayloadAction<ISection[]>) => {
      state.sections = action.payload;
      return state;
    },

    navigateToNextSection: (state: SectionsState) => {
      const potentialNewIndex = state.currentSectionIndex + 1;

      if (potentialNewIndex < state.sections.length) {
        state.currentSectionIndex = potentialNewIndex;
      }
      return state;
    },

    navigateToPreviousSection: (state: SectionsState) => {
      if (state.currentSectionIndex > 0) {
        state.currentSectionIndex = state.currentSectionIndex - 1;
      }
      return state;
    },
  },
});

export const isBackwardNavigationPossible = (state: RootState) =>
  state.sectionsState.currentSectionIndex > 0;

export const { setSections, navigateToNextSection, navigateToPreviousSection } =
  sectionsSlice.actions;
