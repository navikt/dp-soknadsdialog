import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NavigationState {
  currentSectionId: string;
  visibleFaktumIds: string[];
}

const initialState: NavigationState = {
  currentSectionId: "",
  visibleFaktumIds: [],
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setCurrentSectionId: (state: NavigationState, action: PayloadAction<string>) => {
      state.currentSectionId = action.payload;
      return state;
    },
    addVisibleFaktumId: (state: NavigationState, action: PayloadAction<string>) => {
      state.visibleFaktumIds.push(action.payload);
    },
    removeVisibleFaktumId: (state: NavigationState, action: PayloadAction<string>) => {
      const currentIndex = state.visibleFaktumIds.findIndex(
        (faktumId: string) => faktumId === action.payload
      );
      if (currentIndex !== -1) {
        state.visibleFaktumIds.splice(currentIndex, 1);
      }
      return state;
    },
  },
});

export const { setCurrentSectionId, addVisibleFaktumId, removeVisibleFaktumId } =
  navigationSlice.actions;
