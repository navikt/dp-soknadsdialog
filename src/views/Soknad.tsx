import React, { useEffect } from "react";
import { Button } from "@navikt/ds-react";
import { useQuiz } from "../context/quiz-context";
import { Section } from "../components/section/Section";
import { Left, Right } from "@navikt/ds-icons";
import { useRouter } from "next/router";
import styles from "./Soknad.module.css";
import { PingLoader } from "../components/PingLoader";
import { useSanity } from "../context/sanity-context";

export function Soknad() {
  const router = useRouter();
  const { getAppTekst } = useSanity();
  const { soknadState, isError, isLoading } = useQuiz();
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

  function goNext() {
    const nextIndex = sectionParam && parseInt(sectionParam) + 1;
    router.push(`/${router.query.uuid}?seksjon=${nextIndex}`, undefined, { shallow: true });
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

      {isLoading && (
        <div className={styles.loaderContainer}>
          <PingLoader />
        </div>
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

        {currentSection.ferdig && !soknadState.ferdig && (
          <Button onClick={() => goNext()}>
            {getAppTekst("knapp.neste")} <Right />
          </Button>
        )}

        {soknadState.ferdig && (
          <Button onClick={() => goToSummary()}>{getAppTekst("soknad.til-oppsummering")}</Button>
        )}
      </nav>

      {isError && <pre>Det har gått ått skaugum</pre>}
    </main>
  );
}
