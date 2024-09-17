import { FileSuccess, Left, Right } from "@navikt/ds-icons";
import { Button } from "@navikt/ds-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ErrorRetryModal } from "../../components/error-retry-modal/ErrorRetryModal";
import { ExitSoknad } from "../../components/exit-soknad/ExitSoknad";
import { getUnansweredFaktumId } from "../../components/faktum/validation/validations.utils";
import { FetchIndicator } from "../../components/fetch-indicator/FetchIndicator";
import { PageMeta } from "../../components/PageMeta";
import { Personalia } from "../../components/personalia/Personalia";
import { ProgressBar } from "../../components/progress-bar/ProgressBar";
import { SoknadHeader } from "../../components/soknad-header/SoknadHeader";
import { Section } from "../../components/section/Section";
import { QUIZ_SOKNADSTYPE_DAGPENGESOKNAD } from "../../constants";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import { useProgressBarSteps } from "../../hooks/useProgressBarSteps";
import { IPersonalia } from "../../types/personalia.types";
import styles from "./Soknad.module.css";
import { ErrorTypesEnum } from "../../types/error.types";
import { trackSkjemaStegFullført } from "../../amplitude.tracking";

interface IProps {
  personalia: IPersonalia | null;
}

export function Soknad(props: IProps) {
  const router = useRouter();
  const { getAppText } = useSanity();
  const { totalSteps } = useProgressBarSteps();
  const { soknadState, isError, isLoading, isLocked } = useQuiz();
  const { unansweredFaktumId, setUnansweredFaktumId } = useValidation();
  const sectionParam = router.query.seksjon as string;
  const [navigating, setNavigating] = useState(false);

  // Vis første seksjon hvis ingenting annet er spesifisert
  const sectionIndex = (sectionParam && parseInt(sectionParam) - 1) || 0;
  const isFirstSection = sectionIndex === 0;
  const isLastSection = sectionIndex === soknadState.seksjoner.length - 1;
  const currentSection = soknadState.seksjoner[sectionIndex];

  const firstUnansweredSectionIndex = soknadState.seksjoner.findIndex((seksjon) => !seksjon.ferdig);
  const firstUnfinishedSection = firstUnansweredSectionIndex + 1;

  const showPersonalia =
    isFirstSection && soknadState.versjon_navn === QUIZ_SOKNADSTYPE_DAGPENGESOKNAD;

  useEffect(() => {
    const validSection = !isNaN(parseInt(sectionParam)) && !!soknadState.seksjoner[sectionIndex];

    // Automatisk redirect til siste ubesvart seksjon dersom man kommer fra inngang siden
    if (router.query.fortsett && !soknadState.ferdig && firstUnansweredSectionIndex !== -1) {
      router.push(`/soknad/${router.query.uuid}?seksjon=${firstUnfinishedSection}`);
    }

    // Hvis vi ikke finner en seksjon så sender vi bruker automatisk til første seksjon
    if (!validSection) {
      router.push(`/soknad/${router.query.uuid}?seksjon=1`, undefined, { shallow: true });
    }
  }, []);

  useEffect(() => {
    if (unansweredFaktumId) {
      setUnansweredFaktumId(undefined);
    }
  }, [soknadState]);

  function navigateToNextSection() {
    if (currentSection.ferdig) {
      const currentSection = parseInt(sectionParam);
      const nextIndex = sectionParam && currentSection + 1;
      trackSkjemaStegFullført("dagpenger", router.query.uuid as string, currentSection);
      router.push(`/soknad/${router.query.uuid}?seksjon=${nextIndex}`, undefined, {
        shallow: true,
      });
    } else {
      const unansweredFaktumId = getUnansweredFaktumId(currentSection.fakta);
      setUnansweredFaktumId(unansweredFaktumId);
    }
  }

  function navigateToPreviousSection() {
    setUnansweredFaktumId(undefined);
    const nextIndex = sectionParam && parseInt(sectionParam) - 1;
    router.push(`/soknad/${router.query.uuid}?seksjon=${nextIndex}`, undefined, { shallow: true });
  }

  function navigateToDocumentation() {
    setNavigating(true);
    router.push(`/soknad/${router.query.uuid}/dokumentasjon`);
  }

  function cancelSoknad() {
    setNavigating(true);
    router.push(`/soknad`);
  }

  return (
    <>
      <PageMeta
        title={getAppText("soknad.side-metadata.tittel")}
        description={getAppText("soknad.side-metadata.meta-beskrivelse")}
      />
      <SoknadHeader />
      <main>
        <ProgressBar currentStep={sectionIndex + 1} totalSteps={totalSteps} />

        {showPersonalia && props.personalia && (
          <div className={styles.seksjonContainer}>
            <Personalia personalia={props.personalia} />
          </div>
        )}

        <Section section={currentSection} />

        <div className={styles.loaderContainer}>
          <FetchIndicator isLoading={isLoading} />
        </div>

        <nav className="navigation-container">
          {isFirstSection ? (
            <Button variant={"secondary"} onClick={() => cancelSoknad()} loading={navigating}>
              {getAppText("soknad.knapp.avbryt")}
            </Button>
          ) : (
            <Button
              variant={"secondary"}
              onClick={() => navigateToPreviousSection()}
              disabled={isLoading || isLocked}
              icon={<Left aria-hidden />}
            >
              {getAppText("soknad.knapp.forrige-steg")}
            </Button>
          )}

          {isLastSection && soknadState.ferdig ? (
            <Button onClick={() => navigateToDocumentation()} loading={navigating}>
              {getAppText("soknad.knapp.til-dokumentasjon")}
            </Button>
          ) : (
            <Button
              onClick={() => navigateToNextSection()}
              icon={<Right aria-hidden />}
              iconPosition={"right"}
              disabled={isLoading || isLocked}
            >
              {getAppText("soknad.knapp.neste-steg")}
            </Button>
          )}
        </nav>

        {!isError && (
          <p className={styles.autoSaveText}>
            <FileSuccess aria-hidden />
            {getAppText("soknad.auto-lagret.tekst")}
          </p>
        )}
        {isError && <ErrorRetryModal errorType={ErrorTypesEnum.GenericError} />}

        <ExitSoknad />
      </main>
    </>
  );
}
