import { FileSuccess, Left, Right } from "@navikt/ds-icons";
import { Button } from "@navikt/ds-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ErrorRetryModal } from "../../components/error-retry-modal/ErrorRetryModal";
import { ExitSoknad } from "../../components/exit-soknad/ExitSoknad";
import { getUnansweredFaktumId } from "../../components/faktum/validation/validations.utils";
import { FetchIndicator } from "../../components/fetch-indicator/FetchIndicator";
import { NoSessionModal } from "../../components/no-session-modal/NoSessionModal";
import { PageMeta } from "../../components/PageMeta";
import { Personalia } from "../../components/personalia/Personalia";
import { ProgressBar } from "../../components/ProgressBar";
import { Section } from "../../components/section/Section";
import { QUIZ_SOKNADSTYPE_DAGPENGESOKNAD } from "../../constants";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import { IPersonalia } from "../../types/personalia.types";
import styles from "./Soknad.module.css";

interface IProps {
  personalia: IPersonalia | null;
}

export function Soknad(props: IProps) {
  const router = useRouter();
  const { getAppText } = useSanity();
  const { soknadState, isError, isLoading, errorType } = useQuiz();
  const { unansweredFaktumId, setUnansweredFaktumId } = useValidation();
  const sectionParam = router.query.seksjon as string;

  // Vis første seksjon hvis ingenting annet er spesifisert
  const sectionIndex = (sectionParam && parseInt(sectionParam) - 1) || 0;
  const isFirstSection = sectionIndex === 0;
  const isLastSection = sectionIndex === soknadState.seksjoner.length - 1;
  const currentSection = soknadState.seksjoner[sectionIndex];
  const firstUnansweredFaktumIndex = currentSection?.fakta?.findIndex(
    (faktum) => faktum?.svar === undefined
  );

  const firstUnansweredSectionIndex = soknadState.seksjoner.findIndex((seksjon) => !seksjon.ferdig);
  const firstUnfinishedSection = firstUnansweredSectionIndex + 1;

  const showPersonalia =
    isFirstSection && soknadState.versjon_navn === QUIZ_SOKNADSTYPE_DAGPENGESOKNAD;

  useEffect(() => {
    const validSection = !isNaN(parseInt(sectionParam)) && !!soknadState.seksjoner[sectionIndex];

    if (!soknadState.ferdig && firstUnansweredSectionIndex !== -1) {
      router.push(`/${router.query.uuid}?seksjon=${firstUnfinishedSection}`);
    }

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
      const unansweredFaktumId = getUnansweredFaktumId(currentSection.fakta);
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
    <>
      <PageMeta
        title={getAppText("soknad.side-metadata.tittel")}
        description={getAppText("soknad.side-metadata.meta-beskrivelse")}
      />
      <main>
        {soknadState.versjon_navn === "Dagpenger" && <ProgressBar currentStep={sectionIndex + 1} />}

        {showPersonalia && props.personalia && (
          <div className={styles.seksjonContainer}>
            <Personalia personalia={props.personalia} />
          </div>
        )}

        <Section
          section={currentSection}
          firstUnansweredFaktumIndex={
            firstUnansweredFaktumIndex === -1
              ? currentSection.fakta.length
              : firstUnansweredFaktumIndex
          }
        />

        <div className={styles.loaderContainer}>
          <FetchIndicator isLoading={isLoading} />
        </div>

        <nav className="navigation-container">
          {isFirstSection ? (
            <Button variant={"secondary"} onClick={() => cancelSoknad()}>
              {getAppText("soknad.knapp.avbryt")}
            </Button>
          ) : (
            <Button
              variant={"secondary"}
              onClick={() => navigateToPreviousSection()}
              icon={<Left />}
            >
              {getAppText("soknad.knapp.forrige-steg")}
            </Button>
          )}

          {isLastSection && soknadState.ferdig ? (
            <Button onClick={() => navigateToDocumentation()}>
              {getAppText("soknad.knapp.til-dokumentasjon")}
            </Button>
          ) : (
            <Button onClick={() => navigateToNextSection()} icon={<Right />} iconPosition={"right"}>
              {getAppText("soknad.knapp.neste-steg")}
            </Button>
          )}
        </nav>

        {!isError && (
          <p className={styles.autoSaveText}>
            <FileSuccess />
            {getAppText("soknad.auto-lagret.tekst")}
          </p>
        )}
        {isError && <ErrorRetryModal errorType={errorType} />}

        <ExitSoknad />
        <NoSessionModal />
      </main>
    </>
  );
}
