import React, { useState } from "react";
import { Section } from "../components/section/Section";
import { Button } from "@navikt/ds-react";
import { QuizState } from "../localhost-data/quiz-state-response";
import { SanityTexts } from "../types/sanity.types";

interface Props {
  soknadState: QuizState;
  sanityTexts: SanityTexts;
}

export function Soknad(props: Props) {
  const [soknadState, setSoknadState] = useState(props.soknadState);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  // const dispatch = useDispatch();
  // const currentSectionIndex = useSelector(
  //   (state: RootState) => state.sectionsState.currentSectionIndex
  // );
  // const currentSection = useSelector(
  //   (state: RootState) => state.sectionsState.sections[currentSectionIndex]
  // );
  // const soknadId = useSelector((state: RootState) => state.soknadId);
  // const sectionsCount = useSelector((state: RootState) => state.sectionsState.sections.length);
  //
  // function handleNavigateNext() {
  //   dispatch(navigateToNextSection());
  // }
  //
  // function handleNavigatePrevious() {
  //   dispatch(navigateToPreviousSection());
  // }
  const currentQuizStateSection = soknadState.seksjoner[currentSectionIndex];

  async function finishSoknad() {
    // await fetch(api(`/soknad/${soknadId}/complete`), {
    //   method: "PUT",
    // });
  }

  return (
    <div>
      {/*<ProgressBar currentStep={currentSectionIndex + 1} totalSteps={sectionsCount} />*/}
      {/*{currentSection && (*/}
      {/*  <Section*/}
      {/*    section={currentSection}*/}
      {/*    navigateNextSection={handleNavigateNext}*/}
      {/*    navigatePreviousSection={handleNavigatePrevious}*/}
      {/*  />*/}
      {/*)}*/}
      <Section
        section={currentQuizStateSection}
        navigateNextSection={() => null}
        navigatePreviousSection={() => null}
      />
      <Button onClick={() => finishSoknad()}>Send inn søknad</Button>
    </div>
  );
}
