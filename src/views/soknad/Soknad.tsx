import { FileSuccess, Left, Right } from "@navikt/ds-icons";
import { Button } from "@navikt/ds-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ErrorRetryModal } from "../../components/error-retry-modal/ErrorRetryModal";
import { FetchIndicator } from "../../components/FetchIndicator";
import { NoSessionModal } from "../../components/no-session-modal/NoSessionModal";
import { Section } from "../../components/section/Section";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import { IQuizGeneratorFaktum, QuizFaktum } from "../../types/quiz.types";
import styles from "./Soknad.module.css";

export function Soknad() {
  const router = useRouter();
  const { getAppTekst } = useSanity();
  const { soknadState, isError, isLoading, errorType } = useQuiz();
  const { unansweredFaktumId, setUnansweredFaktumId } = useValidation();
  const sectionParam = router.query.seksjon as string;

  // Vis første seksjon hvis ingenting annet er spesifisert
  const sectionIndex = (sectionParam && parseInt(sectionParam) - 1) || 0;
  const currentSection = soknadState.seksjoner[sectionIndex];
  const isFirstSection = sectionIndex === 0;
  const firstUnansweredFaktumIndex = currentSection?.fakta?.findIndex(
    (faktum) => faktum?.svar === undefined
  );

  function getUnansweredGeneratorFaktumId(generatorFaktum: IQuizGeneratorFaktum) {
    for (const generatorFaktumSvar of generatorFaktum.svar ?? []) {
      const unansweredGeneratorFaktum = generatorFaktumSvar.find(
        (faktum: QuizFaktum) => faktum.svar === undefined
      );

      if (unansweredGeneratorFaktum) {
        return unansweredGeneratorFaktum.id;
      }
    }
  }

  function getUnansweredFaktumId() {
    for (const fakta of currentSection.fakta) {
      if (fakta.type !== "generator") {
        if (fakta.svar === undefined) {
          return fakta.id;
        }
      } else {
        const unansweredGeneratorFaktumId = getUnansweredGeneratorFaktumId(fakta);
        if (unansweredGeneratorFaktumId) {
          return unansweredGeneratorFaktumId;
        }
      }
    }
  }

  useEffect(() => {
    const validSection = !isNaN(parseInt(sectionParam)) && !!soknadState.seksjoner[sectionIndex];

    // Hvis vi ikke finner en seksjon så sender vi bruker automatisk til første seksjon
    if (!validSection) {
      router.push(`/${router.query.uuid}?seksjon=1`, undefined, { shallow: true });
    }
  }, []);

  useEffect(() => {
    if (unansweredFaktumId) {
      setUnansweredFaktumId(undefined);
    }
  }, [soknadState]);

  function navigateToNextSection() {
    if (currentSection.ferdig) {
      const nextIndex = sectionParam && parseInt(sectionParam) + 1;
      router.push(`/${router.query.uuid}?seksjon=${nextIndex}`, undefined, { shallow: true });
    } else {
      const unansweredFaktumId = getUnansweredFaktumId();
      setUnansweredFaktumId(unansweredFaktumId);
    }
  }

  function navigateToPreviousSection() {
    setUnansweredFaktumId(undefined);
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
