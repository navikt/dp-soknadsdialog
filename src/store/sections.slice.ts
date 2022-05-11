import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./index";

export interface SectionsState {
  sections: any[];
  currentSectionIndex: number;
  sectionFaktumIndex: number;
}

export const initialSectionsState: SectionsState = {
  sections: [],
  currentSectionIndex: 0,
  sectionFaktumIndex: 0,
};

export const sectionsSlice = createSlice({
  name: "sections",
  initialState: initialSectionsState,
  reducers: {
    setSections: (state: SectionsState, action: PayloadAction<any[]>) => {
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
    setSectionFaktumIndex: (state: SectionsState, action: PayloadAction<number>) => {
      state.sectionFaktumIndex = action.payload;
      return state;
    },
  },
});

export const isBackwardNavigationPossible = (state: RootState) =>
  state.sectionsState.currentSectionIndex > 0;

export const {
  setSections,
  navigateToNextSection,
  navigateToPreviousSection,
  setSectionFaktumIndex,
} = sectionsSlice.actions;
