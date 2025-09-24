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
import { Section } from "../../components/section/Section";
import { SoknadHeader } from "../../components/soknad-header/SoknadHeader";
import { QUIZ_SOKNADSTYPE_DAGPENGESOKNAD } from "../../constants";
import { useSanity } from "../../context/sanity-context";
import { useSoknad } from "../../context/soknad-context";
import { useValidation } from "../../context/validation-context";
import { useProgressBarSteps } from "../../hooks/useProgressBarSteps";
import { ErrorTypesEnum } from "../../types/error.types";
import { IPersonalia } from "../../types/personalia.types";

import styles from "./Soknad.module.css";

interface IProps {
  personalia: IPersonalia | null;
}

export function Soknad(props: IProps) {
  const router = useRouter();
  const { getAppText } = useSanity();
  const { totalSteps } = useProgressBarSteps();
  const { quizState, isError, isLoading, isLocked } = useSoknad();
  const { unansweredFaktumId, setUnansweredFaktumId } = useValidation();
  const sectionParam = router.query.seksjon as string;
  const [navigating, setNavigating] = useState(false);

  // Vis første seksjon hvis ingenting annet er spesifisert
  const sectionIndex = (sectionParam && parseInt(sectionParam) - 1) || 0;
  const isFirstSection = sectionIndex === 0;
  const isLastSection = sectionIndex === quizState.seksjoner.length - 1;
  const currentSection = quizState.seksjoner[sectionIndex];

  const firstUnansweredSectionIndex = quizState.seksjoner.findIndex((seksjon) => !seksjon.ferdig);
  const firstUnfinishedSection = firstUnansweredSectionIndex + 1;

  const showPersonalia =
    isFirstSection && quizState.versjon_navn === QUIZ_SOKNADSTYPE_DAGPENGESOKNAD;

  useEffect(() => {
    const validSection = !isNaN(parseInt(sectionParam)) && !!quizState.seksjoner[sectionIndex];

    // Automatisk redirect til siste ubesvart seksjon dersom man kommer fra inngang siden
    if (router.query.fortsett && !quizState.ferdig && firstUnansweredSectionIndex !== -1) {
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
  }, [quizState]);

  function navigateToNextSection() {
    if (currentSection.ferdig) {
      const currentSection = parseInt(sectionParam);
      const nextIndex = sectionParam && currentSection + 1;
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
      <main id="maincontent" tabIndex={-1}>
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

          {isLastSection && quizState.ferdig ? (
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
