import { configureStore } from "@reduxjs/toolkit";
import { combinedRootReducer } from ".";
import { soknadIdSlice } from "./soknadId.slice";

const store = configureStore({
  reducer: combinedRootReducer,
});

describe("soknadId reducer", () => {
  let state: string;

  it("should set the initial state to an empty string", () => {
    expect(store.getState().soknadId).toEqual("");
  });

  it("sets soknadId correctly", () => {
    const testId = "soknad-testID";
    store.dispatch(soknadIdSlice.actions.setSoknadId(testId));
    state = store.getState().soknadId;
    expect(state).toEqual(testId);
  });
});
