import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FaktumState {
  beskrivendeId: string;
  loading: boolean;
  errorMessages: string[];
}

export const faktaStateSlice = createSlice({
  name: "faktaState",
  initialState: [] as FaktumState[],
  reducers: {
    setFaktumState: (state: FaktumState[], action: PayloadAction<FaktumState>): FaktumState[] => {
      const currentIndex = state.findIndex(
        (faktum) => faktum.beskrivendeId === action.payload.beskrivendeId
      );
      if (currentIndex !== undefined) {
        state[currentIndex] = action.payload;
      } else {
        state.push(action.payload);
      }
      return state;
    },
  },
});
