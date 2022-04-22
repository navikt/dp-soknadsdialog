import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NavigationState {
  sectionFaktumIndex: number;
}

const initialState: NavigationState = {
  sectionFaktumIndex: 0,
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setSectionFaktumIndex: (state: NavigationState, action: PayloadAction<number>) => {
      state.sectionFaktumIndex = action.payload;
      return state;
    },
  },
});

export const { setSectionFaktumIndex } = navigationSlice.actions;
