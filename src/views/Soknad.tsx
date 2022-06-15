import React, { useEffect, useState } from "react";
import { Button } from "@navikt/ds-react";
import { useQuiz } from "../context/quiz-context";
import { Section } from "../components/section/Section";
import { Left, Right } from "@navikt/ds-icons";
import { useRouter } from "next/router";
import styles from "./Soknad.module.css";
import { PingLoader } from "../components/PingLoader";
import { QuizFaktum, QuizGeneratorFaktum } from "../types/quiz.types";
import { isGeneratorFaktum } from "../types/type-guards";

function isFaktumAnswered(faktum: QuizFaktum | QuizGeneratorFaktum) {
  if (isGeneratorFaktum(faktum)) {
    return faktum.svar?.every((faktum) => faktum.every((faktum) => faktum.svar !== undefined));
  }
  return faktum.svar !== undefined;
}

export function Soknad() {
  const router = useRouter();
  const { soknadState, isError, isLoading } = useQuiz();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showNextSectionButton, setShowNextSectionButton] = useState(false);

  const currentSection = soknadState.seksjoner[currentSectionIndex];
  const firstUnansweredFaktumIndex = currentSection.fakta?.findIndex(
    (faktum) => faktum?.svar === undefined
  );
  const allFaktaInSectionAnswered = currentSection.fakta.every(isFaktumAnswered);

  const isLastSection = currentSectionIndex === soknadState.seksjoner.length - 1;
  const isFirstSection = currentSectionIndex === 0;

  useEffect(() => {
    if (allFaktaInSectionAnswered && !isLastSection) {
      setShowNextSectionButton(true);
    } else {
      setShowNextSectionButton(false);
    }
  }, [allFaktaInSectionAnswered]);

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

  function cancelSoknad() {
    router.push(`/`);
  }

  return (
    <main>
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
        {isFirstSection ? (
          <Button variant={"secondary"} onClick={() => cancelSoknad()}>
            Avbryt søknad
          </Button>
        ) : (
          <Button variant={"secondary"} onClick={() => navigatePreviousSection()}>
            <Left />
            Forrige steg
          </Button>
        )}

        {showNextSectionButton && (
          <Button onClick={() => navigateNextSection()}>
            Neste steg <Right />
          </Button>
        )}

        {isLastSection && <Button onClick={() => finishSoknad()}>Send inn søknad</Button>}
      </nav>

      {isError && <pre>Det har gått ått skaugum</pre>}
      {isLoading && <PingLoader />}
    </main>
  );
}
