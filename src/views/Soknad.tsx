import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Section } from "../components/section/Section";
import { RootState } from "../store";
import { Button } from "@navikt/ds-react";
import api from "../api.utils";
import { ProgressBar } from "../components/ProgressBar";
import { navigateToNextSection, navigateToPreviousSection } from "../store/sections.slice";

export function Soknad() {
  const dispatch = useDispatch();
  const currentSectionIndex = useSelector(
    (state: RootState) => state.sectionsState.currentSectionIndex
  );
  const currentSection = useSelector(
    (state: RootState) => state.sectionsState.sections[currentSectionIndex]
  );
  const soknadId = useSelector((state: RootState) => state.soknadId);
  const sectionsCount = useSelector((state: RootState) => state.sectionsState.sections.length);

  function handleNavigateNext() {
    dispatch(navigateToNextSection());
  }

  function handleNavigatePrevious() {
    dispatch(navigateToPreviousSection());
  }

  async function finishSoknad() {
    await fetch(api(`/soknad/${soknadId}/complete`), {
      method: "PUT",
    });
  }

  return (
    <div>
      <ProgressBar currentStep={currentSectionIndex + 1} totalSteps={sectionsCount} />
      {currentSection && (
        <Section
          section={currentSection}
          navigateNextSection={handleNavigateNext}
          navigatePreviousSection={handleNavigatePrevious}
        />
      )}
      <Button onClick={() => finishSoknad()}>Send inn søknad</Button>
    </div>
  );
}
