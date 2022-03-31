import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Section } from "../components/section/Section";
import { RootState } from "../store";
import { setCurrentSectionIndex } from "../store/navigation.slice";

export function Soknad() {
  const dispatch = useDispatch();
  const currentSectionIndex = useSelector(
    (state: RootState) => state.navigation.currentSectionIndex
  );
  const currentSection = useSelector((state: RootState) => state.sections[currentSectionIndex]);

  function handleNavigateNext() {
    dispatch(setCurrentSectionIndex(currentSectionIndex + 1));
  }

  function handleNavigatePrevious() {
    dispatch(setCurrentSectionIndex(currentSectionIndex - 1));
  }

  return (
    <div>
      {currentSection && (
        <Section
          section={currentSection}
          navigateNextSection={handleNavigateNext}
          navigatePreviousSection={handleNavigatePrevious}
        />
      )}
    </div>
  );
}
