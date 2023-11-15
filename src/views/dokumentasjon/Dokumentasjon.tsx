import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button, Detail, ErrorSummary, Heading } from "@navikt/ds-react";
import { PageMeta } from "../../components/PageMeta";
import { SoknadHeader } from "../../components/soknad-header/SoknadHeader";
import { ProgressBar } from "../../components/progress-bar/ProgressBar";
import { PortableText } from "@portabletext/react";
import { ReadMore } from "../../components/sanity/readmore/ReadMore";
import { useSanity } from "../../context/sanity-context";
import { useProgressBarSteps } from "../../hooks/useProgressBarSteps";
import { DokumentkravItem } from "./DokumentkravItem";
import { useDokumentkrav } from "../../context/dokumentkrav-context";
import { useDokumentkravBundler } from "../../hooks/useDokumentkravBundler";
import { useUuid } from "../../hooks/useUuid";
import { useRouter } from "next/router";
import { DokumentkravTitle } from "../../components/dokumentkrav-title/DokumentkravTitle";
import { useScrollIntoView } from "../../hooks/useScrollIntoView";
import { DokumentkravBundleErrorModal } from "./DokumentkravBundleErrorModal";
import { ExitSoknad } from "../../components/exit-soknad/ExitSoknad";
import { NoSessionModal } from "../../components/no-session-modal/NoSessionModal";
import styles from "./Dokumentasjon.module.css";
import { tidBruktSiden, tidStart, trackDokumentasjonLastetOpp } from "../../amplitude.tracking";
import { DOKUMENTKRAV_SVAR_SEND_NAA } from "../../constants";
import { useQuiz } from "../../context/quiz-context";

export function Dokumentasjon() {
  const router = useRouter();
  const { uuid } = useUuid();
  const { scrollIntoView } = useScrollIntoView();
  const { getAppText, getInfosideText } = useSanity();
  const { totalSteps, documentationStep } = useProgressBarSteps();
  const { soknadState } = useQuiz();
  const { dokumentkravList, getFirstUnansweredDokumentkrav } = useDokumentkrav();
  const [showBundleErrorModal, setShowBundleErrorModal] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [dokumentkravError, setDokumentkravError] = useState(false);
  const { isBundling, dokumentkravWithBundleError, bundleDokumentkravList } =
    useDokumentkravBundler();

  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const firstUnansweredDokumentkrav = getFirstUnansweredDokumentkrav();
  const firstUnansweredIndex = dokumentkravList.krav.findIndex(
    (dokumentkrav) => dokumentkrav.id === firstUnansweredDokumentkrav?.id
  );
  const allDokumentkravAnswered = firstUnansweredIndex === -1;

  const dokumentasjonsText = getInfosideText("dokumentasjonskrav");
  const numberOfDokumentkravText = getAppText("dokumentkrav.antall-krav-av");
  const numberOfDokumentkrav = dokumentkravList.krav.length;

  useEffect(() => {
    if (showBundleErrorModal && dokumentkravWithBundleError.length > 0) {
      scrollIntoView(errorSummaryRef);
    }
  }, [showBundleErrorModal, dokumentkravWithBundleError]);

  async function bundleAndSaveAllDokumentkrav() {
    if (!allDokumentkravAnswered) {
      setDokumentkravError(true);
      return;
    }

    const dokumentkravToBundle = dokumentkravList.krav.filter((dokumentkrav) => {
      return dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NAA && dokumentkrav.filer.length > 0;
    });

    const startetBundling = tidStart();
    const shouldBundle = dokumentkravToBundle.length > 0;
    const bundlingSuccessful = shouldBundle && (await bundleDokumentkravList(dokumentkravToBundle));

    // If there are no dokumentkrav to bundle then we automatically want to move on to the next step
    if (bundlingSuccessful || !shouldBundle) {
      if (shouldBundle) {
        trackDokumentasjonLastetOpp(dokumentkravToBundle.length, tidBruktSiden(startetBundling));
      }

      setIsNavigating(true);
      router.push(`/soknad/${uuid}/oppsummering`);
    } else {
      setShowBundleErrorModal(true);
    }
  }

  function resetDokumentkravError() {
    setDokumentkravError(false);
  }

  return (
    <main>
      <PageMeta
        title={getAppText("dokumentkrav.side-metadata.tittel")}
        description={getAppText("dokumentkrav.side-metadata.meta-beskrivelse")}
      />

      <SoknadHeader />

      <ProgressBar currentStep={documentationStep} totalSteps={totalSteps} />

      {dokumentkravWithBundleError.length > 0 && (
        <ErrorSummary
          size="medium"
          ref={errorSummaryRef}
          heading={getAppText("ettersending.feilmelding.oppsummering.tittel")}
        >
          {dokumentkravWithBundleError.map((krav) => (
            <ErrorSummary.Item key={krav.id} href={`#${krav.id}`}>
              <DokumentkravTitle dokumentkrav={krav} />
            </ErrorSummary.Item>
          ))}
        </ErrorSummary>
      )}

      {dokumentasjonsText?.body && (
        <PortableText
          value={dokumentasjonsText.body}
          components={{ types: { readMore: ReadMore } }}
        />
      )}

      <Heading size={"medium"} level={"3"} className={styles.dokumentkravTitle}>
        {getAppText("dokumentasjon.dokumentkrav.tittel")}
      </Heading>

      {dokumentkravList.krav.map((dokumentkrav, index) => {
        const dokumentkravNumber = index + 1;
        const hasUnansweredError = dokumentkravError && index === firstUnansweredIndex;
        const hasBundleError = dokumentkravWithBundleError.some(
          (krav) => krav.id === dokumentkrav.id
        );

        if (index <= firstUnansweredIndex || allDokumentkravAnswered) {
          return (
            <div key={index}>
              <Detail>{`${dokumentkravNumber} ${numberOfDokumentkravText} ${numberOfDokumentkrav}`}</Detail>
              <DokumentkravItem
                dokumentkrav={dokumentkrav}
                resetError={resetDokumentkravError}
                hasBundleError={hasBundleError}
                hasUnansweredError={hasUnansweredError}
              />
            </div>
          );
        }
      })}

      <nav className="navigation-container">
        <Link
          href={`/soknad/${uuid}?seksjon=${soknadState.seksjoner.length}`}
          passHref
          legacyBehavior
        >
          <Button as="a" variant="secondary">
            {getAppText("soknad.knapp.forrige-steg")}
          </Button>
        </Link>

        <Button
          variant="primary"
          onClick={bundleAndSaveAllDokumentkrav}
          loading={isBundling || isNavigating}
        >
          {getAppText("soknad.knapp.til-oppsummering")}
        </Button>
      </nav>

      <DokumentkravBundleErrorModal
        dokumentkravList={dokumentkravWithBundleError}
        isOpen={showBundleErrorModal}
        toggleVisibility={setShowBundleErrorModal}
      />

      <div className="my-6">
        <ExitSoknad />
      </div>

      <NoSessionModal />
    </main>
  );
}
