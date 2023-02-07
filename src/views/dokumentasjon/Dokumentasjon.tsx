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

export function Dokumentasjon() {
  const router = useRouter();
  const { uuid } = useUuid();
  const { scrollIntoView } = useScrollIntoView();
  const { getAppText, getInfosideText } = useSanity();
  const { totalSteps, documentationStep } = useProgressBarSteps();
  const { dokumentkravList, getFirstUnansweredDokumentkrav } = useDokumentkrav();
  const [showBundleErrorModal, setShowBundleErrorModal] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [dokumentkravError, setDokumentkravError] = useState(false);
  const {
    isBundling,
    dokumentkravWithBundleError,
    dokumentkravWithNewFiles,
    removeDokumentkrav,
    bundleAndSaveDokumentkrav,
    addDokumentkravWithNewFiles,
    setInitialDokumentkravWithNewFilesState,
  } = useDokumentkravBundler();

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
    const dokumentkravToBundleState = dokumentkravList.krav.filter(
      (dokumentkrav) =>
        dokumentkrav.svar === "dokumentkrav.svar.send.naa" && dokumentkrav.filer.length > 0
    );

    setInitialDokumentkravWithNewFilesState(dokumentkravToBundleState);
  }, []);

  useEffect(() => {
    if (dokumentkravWithBundleError.length > 0) {
      scrollIntoView(errorSummaryRef);
    }
  }, [dokumentkravWithBundleError.length]);

  async function bundleAndSaveAllDokumentkrav() {
    if (!allDokumentkravAnswered) {
      setDokumentkravError(true);
      return;
    }
    const startetBundling = tidStart();

    let allBundlesSuccessful = true;
    for (const dokumentkrav of dokumentkravWithNewFiles) {
      const res = await bundleAndSaveDokumentkrav(dokumentkrav);
      if (!res) {
        allBundlesSuccessful = false;
      }
    }

    if (allBundlesSuccessful) {
      trackDokumentasjonLastetOpp(dokumentkravWithNewFiles.length, tidBruktSiden(startetBundling));
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
            <>
              <Detail>{`${dokumentkravNumber} ${numberOfDokumentkravText} ${numberOfDokumentkrav}`}</Detail>
              <DokumentkravItem
                key={index}
                dokumentkrav={dokumentkrav}
                resetError={resetDokumentkravError}
                removeDokumentkravToBundle={removeDokumentkrav}
                addDokumentkravToBundle={addDokumentkravWithNewFiles}
                hasBundleError={hasBundleError}
                hasUnansweredError={hasUnansweredError}
              />
            </>
          );
        }
      })}

      <nav className="navigation-container">
        <Link href={`/soknad/${uuid}/kvittering`} passHref>
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
