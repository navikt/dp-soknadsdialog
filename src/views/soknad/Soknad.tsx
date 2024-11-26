import { FileSuccess, Left, Right } from "@navikt/ds-icons";
import { Button } from "@navikt/ds-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ErrorRetryModal } from "../../components/error-retry-modal/ErrorRetryModal";
import { ExitSoknad } from "../../components/exit-soknad/ExitSoknad";
import { FetchIndicator } from "../../components/fetch-indicator/FetchIndicator";
import { PageMeta } from "../../components/PageMeta";
import { Personalia } from "../../components/personalia/Personalia";
import { ProgressBar } from "../../components/progress-bar/ProgressBar";
import { SoknadHeader } from "../../components/soknad-header/SoknadHeader";
import { Section } from "../../components/section/Section";
import { useSoknad } from "../../context/soknad-context";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import { useProgressBarSteps } from "../../hooks/useProgressBarSteps";
import { IPersonalia } from "../../types/personalia.types";
import styles from "./Soknad.module.css";
import { ErrorTypesEnum } from "../../types/error.types";
import { QuizSection } from "../../components/section/QuizSection";
import { getUnansweredFaktumId } from "../../components/faktum/validation/validations.utils";
// import { trackSkjemaStegFullført } from "../../amplitude.tracking";

interface IProps {
  personalia: IPersonalia | null;
}

export function Soknad(props: IProps) {
  const router = useRouter();
  const { getAppText } = useSanity();
  const { totalSteps } = useProgressBarSteps();
  const { quizState: soknadState, orkestratorState, isError, isLoading, isLocked } = useSoknad();
  const { unansweredFaktumId, setUnansweredFaktumId } = useValidation();
  const [navigating, setNavigating] = useState(false);

  // Vis første seksjon hvis ingenting annet er spesifisert
  const sectionParams = router.query.seksjon;
  const invalidSectionParams = isNaN(Number(sectionParams));
  const sectionNumber = invalidSectionParams ? 1 : Number(sectionParams);
  const sectionIndex = sectionNumber - 1;
  const isLastSection = soknadState.ferdig && orkestratorState && orkestratorState.erFullført;

  // Number of sections
  const numberOfOrkestratorSections = (orkestratorState && orkestratorState.antallSeksjoner) || 0;
  const isOrkestratorSection = sectionNumber <= numberOfOrkestratorSections;

  // Orkestrator and Quiz section data based on sectionParams
  const currentOrkestratorSectionData =
    orkestratorState && orkestratorState.seksjoner[sectionIndex];
  const currentQuizSectionData = soknadState.seksjoner[sectionIndex - numberOfOrkestratorSections];

  // Validation
  const firstUnansweredSectionIndex = soknadState.seksjoner.findIndex((seksjon) => !seksjon.ferdig);
  const firstUnfinishedSection = firstUnansweredSectionIndex + 1;

  // Teste commit
  useEffect(() => {
    // Automatisk redirect til siste ubesvart seksjon dersom man kommer fra inngang siden
    if (router.query.fortsett && !soknadState.ferdig && firstUnansweredSectionIndex !== -1) {
      router.push(`/soknad/${router.query.uuid}?seksjon=${firstUnfinishedSection}`);
    }

    const availiableSections =
      soknadState.seksjoner.length + ((orkestratorState && orkestratorState?.antallSeksjoner) || 0);

    if (invalidSectionParams || sectionNumber > availiableSections) {
      // Hvis vi ikke finner en seksjon så sender vi bruker automatisk til første seksjon
      router.push(`/soknad/${router.query.uuid}?seksjon=1`, undefined, {
        shallow: true,
      });
    }
  }, []);

  useEffect(() => {
    if (unansweredFaktumId) {
      setUnansweredFaktumId(undefined);
    }
  }, [soknadState, orkestratorState]);

  function navigateToNextSection() {
    if (isOrkestratorSection) {
      if (currentOrkestratorSectionData && !currentOrkestratorSectionData.erFullført) {
        setUnansweredFaktumId(currentOrkestratorSectionData.nesteUbesvarteOpplysning.opplysningId);
      } else {
        const nextIndex = sectionNumber + 1;
        router.push(`/soknad/${router.query.uuid}?seksjon=${nextIndex}`, undefined, {
          shallow: true,
        });
      }
    }

    if (!isOrkestratorSection) {
      if (!currentQuizSectionData.ferdig) {
        const unansweredFaktumId = getUnansweredFaktumId(currentQuizSectionData.fakta);
        setUnansweredFaktumId(unansweredFaktumId);
      } else {
        const nextIndex = sectionNumber + 1;
        router.push(`/soknad/${router.query.uuid}?seksjon=${nextIndex}`, undefined, {
          shallow: true,
        });
      }
    }
  }

  function navigateToPreviousSection() {
    if (unansweredFaktumId) {
      setUnansweredFaktumId(undefined);
    }

    const previousIndex = sectionNumber - 1;
    router.push(`/soknad/${router.query.uuid}?seksjon=${previousIndex}`, undefined, {
      shallow: true,
    });
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
        <ProgressBar currentStep={sectionNumber} totalSteps={totalSteps} />

        {sectionNumber === 1 && props.personalia && (
          <div className={styles.seksjonContainer}>
            <Personalia personalia={props.personalia} />
          </div>
        )}

        {isOrkestratorSection && currentOrkestratorSectionData && (
          <Section section={currentOrkestratorSectionData} />
        )}
        {!isOrkestratorSection && <QuizSection section={currentQuizSectionData} />}

        <div className={styles.loaderContainer}>
          <FetchIndicator isLoading={isLoading} />
        </div>

        <nav className="navigation-container">
          {sectionNumber === 1 ? (
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

          {/* Denne her er kanskje ikke helt riktig, fiks det  */}
          {sectionNumber === totalSteps - 2 && isLastSection && soknadState.ferdig ? (
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
