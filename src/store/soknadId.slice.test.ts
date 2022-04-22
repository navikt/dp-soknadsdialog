import { Action } from "@reduxjs/toolkit";
import { setSoknadId, soknadIdSlice } from "./soknadId.slice";

const { reducer } = soknadIdSlice;

describe("soknadId reducer", () => {
  it("should set the initial state to an empty string", () => {
    const newState = reducer(undefined, {} as Action);
    expect(newState).toEqual("");
  });

  it("sets soknadId correctly", () => {
    const testId = "soknad-testID";
    const newState = reducer(undefined, setSoknadId(testId));
    expect(newState).toEqual(testId);
  });
});
