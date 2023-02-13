import React, { useEffect, useState } from "react";
import { Button } from "@navikt/ds-react";
import { ErrorRetryModal } from "../../components/error-retry-modal/ErrorRetryModal";
import { FetchIndicator } from "../../components/fetch-indicator/FetchIndicator";
import { NoSessionModal } from "../../components/no-session-modal/NoSessionModal";
import { PageMeta } from "../../components/PageMeta";
import { Section } from "../../components/section/Section";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import { useUuid } from "../../hooks/useUuid";
import { GenerellInnsendingDocument } from "./GenerellInnsendingDocument";
import { useDokumentkravBundler } from "../../hooks/useDokumentkravBundler";
import { usePutRequest } from "../../hooks/usePutRequest";
import { DOKUMENTKRAV_SVAR_SEND_NAA } from "../../constants";
import { DeleteProsessModal } from "../../components/exit-soknad/DeleteProsessModal";
import { ValidationMessage } from "../../components/faktum/validation/ValidationMessage";
import styles from "./GenerellInnsending.module.css";
import { useRouter } from "next/router";
import { useFirstRender } from "../../hooks/useFirstRender";
import { IDokumentkravSvarBody } from "../../pages/api/documentation/svar";
import { ErrorTypesEnum } from "../../types/error.types";
import { IFerdigstillBody } from "../../pages/api/soknad/ferdigstill";
import { type Locale } from "@navikt/nav-dekoratoren-moduler/ssr";
import { useDokumentkrav } from "../../context/dokumentkrav-context";

export function GenerellInnsending() {
  const router = useRouter();
  const { uuid } = useUuid();
  const { getAppText } = useSanity();
  const isFirstRender = useFirstRender();
  const { soknadState, isError, isLoading } = useQuiz();
  const { dokumentkravList, getDokumentkravList, setDokumentkravList } = useDokumentkrav();
  const { unansweredFaktumId, setUnansweredFaktumId } = useValidation();
  const [deleteSoknadModalOpen, setDeleteSoknadModalOpen] = useState(false);
  const [generalError, setGeneralError] = useState(false);
  // Generell innsending har bare 1 seksjon.
  const currentSection = soknadState.seksjoner[0];
  const shouldRenderDokumentkrav = dokumentkravList && dokumentkravList.krav.length > 0;
  const { isBundling, noDocumentsToSave, dokumentkravWithBundleError, bundleDokumentkravList } =
    useDokumentkravBundler();
  const [saveDokumentkravSvar] = usePutRequest<IDokumentkravSvarBody>("documentation/svar");
  const [ferdigstillInnsending, ferdigstillInnsendingStatus] =
    usePutRequest<IFerdigstillBody>("soknad/ferdigstill");

  async function getDokumentkrav() {
    const newestDokumentkravList = await getDokumentkravList();

    if (newestDokumentkravList) {
      setDokumentkravList(newestDokumentkravList);
    }
  }

  useEffect(() => {
    if (unansweredFaktumId) {
      setUnansweredFaktumId(undefined);
    }
  }, [soknadState]);

  useEffect(() => {
    if (!isFirstRender) {
      getDokumentkrav();
    }
  }, [soknadState.ferdig]);

  // Dokumentkravet til generell innsending kommer uten svar, men svaret må settes uten input fra bruker.
  useEffect(() => {
    if (dokumentkravList) {
      for (const dokumentkrav of dokumentkravList.krav) {
        if (!dokumentkrav.svar) {
          saveDokumentkravSvar({
            uuid,
            dokumentkravId: dokumentkrav.id,
            dokumentkravSvar: {
              svar: DOKUMENTKRAV_SVAR_SEND_NAA,
            },
          });
        }
      }
    }
  }, [dokumentkravList]);

  useEffect(() => {
    if (ferdigstillInnsendingStatus === "success") {
      router.push(`/generell-innsending/${uuid}/kvittering`);
    }
  }, [ferdigstillInnsendingStatus]);

  async function bundleAndSaveAllDokumentkrav() {
    setGeneralError(false);
    const newestDokumentkravList = await getDokumentkravList();

    if (!newestDokumentkravList) {
      setGeneralError(true);
      return;
    }

    const dokumentkravToBundle = newestDokumentkravList.krav.filter((dokumentkrav) => {
      return dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NAA && dokumentkrav.filer.length > 0;
    });

    const bundlingSuccessful = await bundleDokumentkravList(dokumentkravToBundle);

    if (bundlingSuccessful) {
      const locale = router.locale as Locale | undefined;
      ferdigstillInnsending({ uuid, locale });
    }
  }

  return (
    <>
      <PageMeta
        title={getAppText("innsending.side-metadata.tittel")}
        description={getAppText("innsending.side-metadata.beskrivelse")}
      />
      <main>
        <Section section={currentSection} />

        {shouldRenderDokumentkrav &&
          dokumentkravList.krav.map((dokumentkrav) => (
            <GenerellInnsendingDocument
              key={dokumentkrav.id}
              dokumentkrav={dokumentkrav}
              hasBundleError={
                !dokumentkravWithBundleError.findIndex((krav) => krav.id === dokumentkrav.id)
              }
            />
          ))}

        {noDocumentsToSave && (
          <ValidationMessage message={getAppText("ettersending.validering.ingen-dokumenter")} />
        )}

        <div className={styles.loaderContainer}>
          <FetchIndicator isLoading={isLoading} />
        </div>

        <nav className="navigation-container">
          <Button
            variant={"primary"}
            onClick={bundleAndSaveAllDokumentkrav}
            loading={isBundling || ferdigstillInnsendingStatus === "pending"}
          >
            {getAppText("generell-innsending.knapp.send-inn")}
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => setDeleteSoknadModalOpen(!deleteSoknadModalOpen)}
          >
            {getAppText("generell-innsending.knapp.avbryt-slett")}
          </Button>
        </nav>

        <DeleteProsessModal
          prosessType={"Innsending"}
          isOpen={deleteSoknadModalOpen}
          handleClose={() => setDeleteSoknadModalOpen(false)}
        />

        {(isError || generalError) && <ErrorRetryModal errorType={ErrorTypesEnum.GenericError} />}

        <NoSessionModal />
      </main>
    </>
  );
}
