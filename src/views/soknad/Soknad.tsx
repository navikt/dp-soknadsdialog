import { FileSuccess, Left, Right } from "@navikt/ds-icons";
import { Alert, Button } from "@navikt/ds-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ErrorRetryModal } from "../../components/error-retry-modal/ErrorRetryModal";
import { FetchIndicator } from "../../components/FetchIndicator";
import { NoSessionModal } from "../../components/no-session-modal/NoSessionModal";
import { Section } from "../../components/section/Section";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { useSectionManager } from "../../hooks/soknad/useSectionManager";
import styles from "./Soknad.module.css";

export function Soknad() {
  const router = useRouter();
  const { getAppTekst } = useSanity();
  const { soknadState, isError, isLoading, errorType } = useQuiz();
  const {
    isValidSection,
    currentSection,
    isFirstSection,
    nextSectionParam,
    previousSectionParam,
    nextUnansweredFaktumIndex,
  } = useSectionManager(soknadState);
  const [showNotFinishedError, setShowNotFinishedError] = useState(false);

  useEffect(() => {
    // Hvis vi ikke finner en seksjon så sender vi bruker automatisk til første seksjon
    if (!isValidSection) {
      router.push(`/${router.query.uuid}?seksjon=1`, undefined, { shallow: true });
    }
  }, []);

  useEffect(() => {
    if (showNotFinishedError) {
      setShowNotFinishedError(false);
    }
  }, [soknadState]);

  function navigateToNextSection() {
    if (currentSection.ferdig) {
      router.push(`/${router.query.uuid}?seksjon=${nextSectionParam}`, undefined, {
        shallow: true,
      });
    } else {
      setShowNotFinishedError(true);
    }
  }

  function navigateToPreviousSection() {
    router.push(`/${router.query.uuid}?seksjon=${previousSectionParam}`, undefined, {
      shallow: true,
    });
  }

  function navigateToDocumentation() {
    router.push(`/${router.query.uuid}/dokumentasjon`);
  }

  function cancelSoknad() {
    router.push(`/`);
  }

  return (
    <main>
      {/*<ProgressBar currentStep={currentSectionIndex + 1} totalSteps={sectionsCount} />*/}

      <div className={styles.seksjonContainer}>
        <Section section={currentSection} firstUnansweredFaktumIndex={nextUnansweredFaktumIndex} />
      </div>

      <div className={styles.loaderContainer}>
        <FetchIndicator isLoading={isLoading} />
      </div>

      {showNotFinishedError && (
        <Alert variant="error" size="medium" inline>
          Du må svare på alle spørsmålene
        </Alert>
      )}

      <nav className="navigation-container">
        {isFirstSection && (
          <Button variant={"secondary"} onClick={() => cancelSoknad()}>
            {getAppTekst("knapp.avbryt")}
          </Button>
        )}

        {!isFirstSection && (
          <Button variant={"secondary"} onClick={() => navigateToPreviousSection()} icon={<Left />}>
            {getAppTekst("knapp.forrige")}
          </Button>
        )}

        {!soknadState.ferdig && (
          <Button onClick={() => navigateToNextSection()} icon={<Right />} iconPosition={"right"}>
            {getAppTekst("knapp.neste")}
          </Button>
        )}

        {soknadState.ferdig && (
          <Button onClick={() => navigateToDocumentation()}>
            {getAppTekst("soknad.til-dokumentasjon")}
          </Button>
        )}
      </nav>

      {!isError && (
        <p className={styles.autoSaveText}>
          <FileSuccess />
          {getAppTekst("auto-lagret.tekst")}
        </p>
      )}
      {isError && <ErrorRetryModal errorType={errorType} />}

      <NoSessionModal />
    </main>
  );
}
