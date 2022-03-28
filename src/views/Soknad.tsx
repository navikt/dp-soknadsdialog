import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { Section } from "../components/section/Section";
import { setCurrentSectionIndex, setSectionFaktumIndex } from "../store/navigation.slice";

export function Soknad() {
  const dispatch = useDispatch();
  const sections = useSelector((state: RootState) => state.sections);
  const currentSectionIndex = useSelector(
    (state: RootState) => state.navigation.currentSectionIndex
  );
  const currentSection = useSelector((state: RootState) => state.sections[currentSectionIndex]);

  function handleNavigateNext() {
    dispatch(setCurrentSectionIndex(currentSectionIndex + 1));
    dispatch(setSectionFaktumIndex(0));
  }

  function handleNavigatePrevious() {
    dispatch(setCurrentSectionIndex(currentSectionIndex - 1));
    dispatch(setSectionFaktumIndex(sections[currentSectionIndex - 1].faktum.length));
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
