import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Section } from "../components/section/Section";
import { RootState } from "../store";
import { setCurrentSectionIndex } from "../store/navigation.slice";
import { Button } from "@navikt/ds-react";
import api from "../api.utils";

export function Soknad() {
  const dispatch = useDispatch();
  const currentSectionIndex = useSelector(
    (state: RootState) => state.navigation.currentSectionIndex
  );
  const currentSection = useSelector((state: RootState) => state.sections[currentSectionIndex]);
  const soknadId = useSelector((state: RootState) => state.soknadId);

  function handleNavigateNext() {
    dispatch(setCurrentSectionIndex(currentSectionIndex + 1));
  }

  function handleNavigatePrevious() {
    dispatch(setCurrentSectionIndex(currentSectionIndex - 1));
  }

  async function finishSoknad() {
    await fetch(api(`/soknad/${soknadId}/complete`), {
      method: "PUT",
    });
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
      <Button onClick={() => finishSoknad()}>Send inn søknad</Button>
    </div>
  );
}
