import { Action } from "@reduxjs/toolkit";
import { answersSlice } from "./answers.slice";

const { reducer } = answersSlice;

describe("answerSlice", () => {
  it("should initialize with empty array", () => {
    const newState = reducer(undefined, {} as Action);
    expect(newState).toEqual([]);
    // expect(getState().answers).toEqual([]);
  });
});
