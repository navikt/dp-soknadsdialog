import React, { useState } from "react";
import { Button } from "@navikt/ds-react";
import { useQuiz } from "../context/quiz-context";
import { Section } from "../components/section/Section";

export function Soknad() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const { soknadState, isError, isLoading } = useQuiz();
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
      <div>
        <pre>{JSON.stringify(soknadState)}</pre>
      </div>
      <Section
        section={currentQuizStateSection}
        navigateNextSection={() => null}
        navigatePreviousSection={() => null}
      />
      <Button onClick={() => finishSoknad()}>Send inn søknad</Button>

      {isError && <pre>Det har gått ått skaugum</pre>}
      {isLoading && <pre>Vi venter på drit treig backend.</pre>}
    </div>
  );
}
