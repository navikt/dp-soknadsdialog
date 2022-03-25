import { configureStore } from "@reduxjs/toolkit";
import { combinedRootReducer } from ".";
import { ISection } from "../types/section.types";
import { sectionsSlice } from "./sections.slice";

const { dispatch, getState } = configureStore({
  reducer: combinedRootReducer,
});

describe("sectionsSlice", () => {
  it("should initialize with empty array", () => {
    expect(getState().sections).toEqual([]);
  });

  it("setSections: should set sections to state", () => {
    const testSections = [{}, {}, {}] as ISection[];
    dispatch(sectionsSlice.actions.setSections(testSections));
    expect(getState().sections).toHaveLength(3);
  });
});
