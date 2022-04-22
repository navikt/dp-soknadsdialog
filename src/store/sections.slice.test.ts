import { Action } from "@reduxjs/toolkit";
import { ISection } from "../types/section.types";
import {
  initialSectionsState,
  navigateToNextSection,
  navigateToPreviousSection,
  sectionsSlice,
  setSections,
} from "./sections.slice";

const { reducer } = sectionsSlice;

describe("sectionsSlice", () => {
  const testSections = [{}, {}, {}] as ISection[];
  it("should initialize with initialState values", () => {
    expect(reducer(undefined, {} as Action)).toEqual(initialSectionsState);
  });

  it("setSections: should set sections to state", () => {
    const newState = reducer(initialSectionsState, setSections(testSections));
    expect(newState.sections).toHaveLength(3);
  });

  describe("navigateToNextSection", () => {
    it("should increase currentSectionIndex by 1", () => {
      const state = {
        sections: testSections,
        currentSectionIndex: 0,
      };
      const newState = reducer(state, navigateToNextSection());
      expect(newState.currentSectionIndex).toEqual(1);
    });

    it("should not increase currentSectionIndex if currenSectionIndex === (sections.length-1) ", () => {
      const state = {
        sections: testSections,
        currentSectionIndex: 2,
      };
      const newState = reducer(state, navigateToNextSection());
      expect(newState.currentSectionIndex).toEqual(2);
    });
  });

  describe("navigateToPreviousSection", () => {
    it("should decrease currentSectionIndex when currentSectionIndex > 0", () => {
      const state = {
        sections: [],
        currentSectionIndex: 3,
      };
      const newState = reducer(state, navigateToPreviousSection());
      expect(newState.currentSectionIndex).toEqual(2);
    });

    it("should not decrease currentSectionIndex when index === 0", () => {
      const newState = reducer(initialSectionsState, navigateToPreviousSection());
      expect(newState.currentSectionIndex).toEqual(0);
    });
  });
});
