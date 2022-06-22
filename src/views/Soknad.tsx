import React, { useEffect } from "react";
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
  const sectionParam = router.query.seksjon as string;

  // Vis første seksjon hvis ingenting annet er spesifisert
  const sectionIndex = (sectionParam && parseInt(sectionParam) - 1) || 0;
  const currentSection = soknadState.seksjoner[sectionIndex];
  const firstUnansweredFaktumIndex = currentSection.fakta?.findIndex(
    (faktum) => faktum?.svar === undefined
  );

  const allFaktaInSectionAnswered = currentSection.fakta.every(isFaktumAnswered);
  const isLastSection = sectionIndex === soknadState.seksjoner.length - 1;
  const isFirstSection = sectionIndex === 0;
  const showNextSectionButton = allFaktaInSectionAnswered && !isLastSection;
  const showPreviousSectionButton = sectionIndex !== 0;

  useEffect(() => {
    // Hvis vi ikke finner en seksjon så sender vi bruker automatisk til første seksjon
    if (!sectionParam) {
      router.push(`/${router.query.uuid}?seksjon=1`, undefined, { shallow: true });
    }
  }, []);

  function navigateNextSection() {
    const nextIndex = sectionParam && parseInt(sectionParam) + 1;
    router.push(`/${router.query.uuid}?seksjon=${nextIndex}`, undefined, { shallow: true });
  }

  function navigatePreviousSection() {
    const nextIndex = sectionParam && parseInt(sectionParam) - 1;
    router.push(`/${router.query.uuid}?seksjon=${nextIndex}`, undefined, { shallow: true });
  }

  async function navigateToSummary() {
    router.push(`/${router.query.uuid}/oppsummering`);
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
        {isFirstSection && (
          <Button variant={"secondary"} onClick={() => cancelSoknad()}>
            Avbryt søknad
          </Button>
        )}

        {showPreviousSectionButton && (
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

        {isLastSection && <Button onClick={() => navigateToSummary()}>Gå til oppsummering</Button>}
      </nav>

      {isError && <pre>Det har gått ått skaugum</pre>}
      {isLoading && <PingLoader />}
    </main>
  );
}
