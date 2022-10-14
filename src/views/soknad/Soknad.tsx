import { FileSuccess, Left, Right } from "@navikt/ds-icons";
import { Alert, Button } from "@navikt/ds-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ErrorRetryModal } from "../../components/error-retry-modal/ErrorRetryModal";
import { FetchIndicator } from "../../components/FetchIndicator";
import { NoSessionModal } from "../../components/no-session-modal/NoSessionModal";
import { Personalia } from "../../components/personalia/Personalia";
import { Section } from "../../components/section/Section";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { IPersonalia } from "../../types/personalia.types";
import styles from "./Soknad.module.css";

interface IProps {
  personalia: IPersonalia | null;
}

export function Soknad(props: IProps) {
  const router = useRouter();
  const { getAppTekst } = useSanity();
  const { soknadState, isError, isLoading, errorType } = useQuiz();
  const [showNotFinishedError, setShowNotFinishedError] = useState(false);
  const sectionParam = router.query.seksjon as string;

  // Vis første seksjon hvis ingenting annet er spesifisert
  const sectionIndex = (sectionParam && parseInt(sectionParam) - 1) || 0;
  const currentSection = soknadState.seksjoner[sectionIndex];
  const isFirstSection = sectionIndex === 0;
  const firstUnansweredFaktumIndex = currentSection?.fakta?.findIndex(
    (faktum) => faktum?.svar === undefined
  );

  useEffect(() => {
    const validSection = !isNaN(parseInt(sectionParam)) && !!soknadState.seksjoner[sectionIndex];

    // Hvis vi ikke finner en seksjon så sender vi bruker automatisk til første seksjon
    if (!validSection) {
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
      const nextIndex = sectionParam && parseInt(sectionParam) + 1;
      router.push(`/${router.query.uuid}?seksjon=${nextIndex}`, undefined, { shallow: true });
    } else {
      setShowNotFinishedError(true);
    }
  }

  function navigateToPreviousSection() {
    const nextIndex = sectionParam && parseInt(sectionParam) - 1;
    router.push(`/${router.query.uuid}?seksjon=${nextIndex}`, undefined, { shallow: true });
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

      {isFirstSection && props.personalia && (
        <div className={styles.seksjonContainer}>
          <Personalia personalia={props.personalia} />
        </div>
      )}

      <div className={styles.seksjonContainer}>
        <Section
          section={currentSection}
          firstUnansweredFaktumIndex={
            firstUnansweredFaktumIndex === -1
              ? currentSection.fakta.length
              : firstUnansweredFaktumIndex
          }
        />
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
