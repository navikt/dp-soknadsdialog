import React, { useEffect, useState } from "react";
import { Button, Alert } from "@navikt/ds-react";
import { useQuiz } from "../context/quiz-context";
import { Section } from "../components/section/Section";
import { Left, Right } from "@navikt/ds-icons";
import { useRouter } from "next/router";
import styles from "./Soknad.module.css";
import { FetchIndicator } from "../components/FetchIndicator";
import ErrorModal from "../components/ErrorModal";
import { useSanity } from "../context/sanity-context";
import { FileSuccess } from "@navikt/ds-icons";

export function Soknad() {
  const router = useRouter();
  const { getAppTekst } = useSanity();
  const { soknadState, isError, isLoading } = useQuiz();
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

  function goNext() {
    if (currentSection.ferdig) {
      const nextIndex = sectionParam && parseInt(sectionParam) + 1;
      router.push(`/${router.query.uuid}?seksjon=${nextIndex}`, undefined, { shallow: true });
    } else {
      setShowNotFinishedError(true);
    }
  }

  function goPrevious() {
    const nextIndex = sectionParam && parseInt(sectionParam) - 1;
    router.push(`/${router.query.uuid}?seksjon=${nextIndex}`, undefined, { shallow: true });
  }

  async function goToSummary() {
    router.push(`/${router.query.uuid}/oppsummering`);
  }

  function cancelSoknad() {
    router.push(`/`);
  }

  return (
    <main>
      {/*<ProgressBar currentStep={currentSectionIndex + 1} totalSteps={sectionsCount} />*/}

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

      <nav className={styles.navigation}>
        {isFirstSection && (
          <Button variant={"secondary"} onClick={() => cancelSoknad()}>
            {getAppTekst("knapp.avbryt")}
          </Button>
        )}

        {!isFirstSection && (
          <Button variant={"secondary"} onClick={() => goPrevious()}>
            <Left />
            {getAppTekst("knapp.forrige")}
          </Button>
        )}

        {!soknadState.ferdig && (
          <Button onClick={() => goNext()}>
            {getAppTekst("knapp.neste")} <Right />
          </Button>
        )}

        {soknadState.ferdig && (
          <Button onClick={() => goToSummary()}>{getAppTekst("soknad.til-oppsummering")}</Button>
        )}
      </nav>

      {!isError && (
        <p className={styles.autoSaveText}>
          <FileSuccess />
          {getAppTekst("auto-lagret.tekst")}
        </p>
      )}
      {isError && (
        <ErrorModal
          title={getAppTekst("teknisk-feil.med-reload.tittel")}
          details={getAppTekst("teknisk-feil.med-reload.detaljer")}
        />
      )}
    </main>
  );
}
