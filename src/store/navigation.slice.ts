import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NavigationState {
  currentSectionIndex: number;
  sectionFaktumIndex: number;
}

const initialState: NavigationState = {
  currentSectionIndex: 0,
  sectionFaktumIndex: 0,
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setCurrentSectionIndex: (state: NavigationState, action: PayloadAction<number>) => {
      state.currentSectionIndex = action.payload;
      return state;
    },
    setSectionFaktumIndex: (state: NavigationState, action: PayloadAction<number>) => {
      state.sectionFaktumIndex = action.payload;
      return state;
    },
    incrementSectionFaktumIndex: (state: NavigationState) => {
      state.sectionFaktumIndex = state.sectionFaktumIndex + 1;
      return state;
    },
  },
});

export const { setCurrentSectionIndex, setSectionFaktumIndex, incrementSectionFaktumIndex } =
  navigationSlice.actions;
