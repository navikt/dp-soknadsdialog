import { configureStore } from "@reduxjs/toolkit";
import { combinedRootReducer } from ".";

const { getState } = configureStore({
  reducer: combinedRootReducer,
});
describe("answerSlice", () => {
  it("should initialize with empty array", () => {
    expect(getState().answers).toEqual([]);
  });
});
