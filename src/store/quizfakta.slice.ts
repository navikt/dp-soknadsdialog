import { createSlice } from "@reduxjs/toolkit";
import { QuizFaktum } from "../types/quiz.types";

export const quizFaktaSlice = createSlice({
  name: "quizFakta",
  initialState: [] as QuizFaktum[],
  reducers: {},
});
