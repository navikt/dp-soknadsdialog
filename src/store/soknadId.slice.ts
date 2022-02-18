import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const soknadIdSlice = createSlice({
  name: "soknadId",
  initialState: "",
  reducers: {
    setSoknadId: (state: string, action: PayloadAction<string>): string => {
      return action.payload;
    },
  },
});
