import React, { useEffect, useState } from "react";
import { Button } from "@navikt/ds-react";
import { useQuiz } from "../context/quiz-context";
import { Section } from "../components/section/Section";
import { Left, Right } from "@navikt/ds-icons";
import styles from "./Soknad.module.css";

export function Soknad() {
  const { soknadState, isError, isLoading } = useQuiz();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showNextSectionButton, setShowNextSectionButton] = useState(false);

  const currentSection = soknadState.seksjoner[currentSectionIndex];
  const firstUnansweredFaktumIndex = currentSection.fakta?.findIndex(
    (faktum) => faktum?.svar === undefined
  );

  useEffect(() => {
    if (firstUnansweredFaktumIndex === -1) {
      setShowNextSectionButton(true);
    }
  }, [firstUnansweredFaktumIndex]);

  function navigateNextSection() {
    setCurrentSectionIndex(() => currentSectionIndex + 1);
  }

  function navigatePreviousSection() {
    setCurrentSectionIndex(() => currentSectionIndex - 1);
  }

  async function finishSoknad() {
    // await fetch(api(`/soknad/${soknadId}/complete`), {
    //   method: "PUT",
    // });
  }

  return (
    <div>
      {/*<ProgressBar currentStep={currentSectionIndex + 1} totalSteps={sectionsCount} />*/}

      <Section
        section={currentSection}
        firstUnansweredFaktumIndex={
          firstUnansweredFaktumIndex === -1
            ? currentSection.fakta.length
            : firstUnansweredFaktumIndex
        }
      />

      <nav className={styles.navigation}>
        <Button variant={"secondary"} onClick={() => navigatePreviousSection()}>
          <Left />
          Forrige steg
        </Button>

        {showNextSectionButton && (
          <Button onClick={() => navigateNextSection()}>
            Neste steg <Right />
          </Button>
        )}
      </nav>

      <Button onClick={() => finishSoknad()}>Send inn søknad</Button>

      {isError && <pre>Det har gått ått skaugum</pre>}
      {isLoading && <pre>Vi venter på quiz-o-rama.</pre>}
    </div>
  );
}
