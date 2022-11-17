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
import useSWR, { useSWRConfig } from "swr";
import api from "../../api.utils";
import { IDokumentkravList } from "../../types/documentation.types";
import { useUuid } from "../../hooks/useUuid";
import { GenerellInnsendingDocument } from "./GenerellInnsendingDocument";
import { useEttersending } from "../../hooks/dokumentkrav/useEttersending";
import {
  ETTERSENDING_VALIDERING_INGEN_DOKUMENTER,
  INNSENDING_SIDE_METADATA_BESKRIVELSE,
  INNSENDING_SIDE_METADATA_TITTEL,
} from "../../text-constants";
import { usePutRequest } from "../../hooks/usePutRequest";
import { saveDokumentkravSvar } from "../../api/dokumentasjon-api";
import { DOKUMENTKRAV_SVAR_SEND_NAA } from "../../constants";
import { DeleteSoknadModal } from "../../components/exit-soknad/DeleteSoknadModal";
import { ValidationMessage } from "../../components/faktum/validation/ValidationMessage";
import styles from "./GenerellInnsending.module.css";
import { useRouter } from "next/router";

export function GenerellInnsending() {
  const router = useRouter();
  const { uuid } = useUuid();
  const { mutate } = useSWRConfig();
  const { getAppText } = useSanity();
  const { soknadState, isError, isLoading, errorType } = useQuiz();
  const { unansweredFaktumId, setUnansweredFaktumId } = useValidation();
  const [deleteSoknadModalOpen, setDeleteSoknadModalOpen] = useState(false);
  const [shouldFetchDokumentkrav, setShouldFetchDokumentkrav] = useState(false);
  const { data, error } = useSWR<IDokumentkravList>(
    shouldFetchDokumentkrav ? api(`/documentation/${uuid}`) : null
  );
  // Generell innsending har bare 1 seksjon.
  const currentSection = soknadState.seksjoner[0];
  const shouldRenderDokumentkrav = data && data.krav?.length > 0;
  const {
    isBundling,
    noDocumentsToSave,
    dokumentkravWithBundleError,
    dokumentkravWithNewFiles,
    removeDokumentkrav,
    isAllDokumentkravValid,
    bundleAndSaveDokumentkrav,
    addDokumentkravWithNewFiles,
  } = useEttersending();
  const [ferdigstillInnsending, ferdigstillInnsendingStatus] = usePutRequest(
    `soknad/${uuid}/ferdigstill?locale=${router.locale}`
  );

  useEffect(() => {
    if (unansweredFaktumId) {
      setUnansweredFaktumId(undefined);
    }

    if (soknadState.ferdig) {
      setShouldFetchDokumentkrav(true);
    }
  }, [soknadState]);

  useEffect(() => {
    mutate(api(`/documentation/${uuid}`));
  }, [soknadState.ferdig]);

  // Dokumentkravet til generell innsending kommer uten svar, men svaret må settes uten input fra bruker.
  useEffect(() => {
    if (data) {
      for (const dokumentkrav of data.krav) {
        saveDokumentkravSvar(uuid, dokumentkrav.id, { svar: DOKUMENTKRAV_SVAR_SEND_NAA });
      }
    }
  }, [data]);

  useEffect(() => {
    if (ferdigstillInnsendingStatus === "success") {
      router.push(`/generell-innsending/${uuid}/kvittering`);
    }
  }, [ferdigstillInnsendingStatus]);

  async function bundleAndSaveAllDokumentkrav() {
    if (isAllDokumentkravValid()) {
      let readyToFerdigstill = true;
      for (const dokumentkrav of dokumentkravWithNewFiles) {
        const res = await bundleAndSaveDokumentkrav(dokumentkrav);
        if (!res) {
          readyToFerdigstill = false;
        }
      }

      if (readyToFerdigstill) {
        ferdigstillInnsending();
      }
    }
  }

  return (
    <>
      <PageMeta
        title={getAppText(INNSENDING_SIDE_METADATA_TITTEL)}
        description={getAppText(INNSENDING_SIDE_METADATA_BESKRIVELSE)}
      />
      <main>
        <Section section={currentSection} />

        {shouldRenderDokumentkrav &&
          data.krav.map((dokumentkrav) => (
            <GenerellInnsendingDocument
              key={dokumentkrav.id}
              dokumentkrav={dokumentkrav}
              addDokumentkrav={addDokumentkravWithNewFiles}
              removeDokumentkrav={removeDokumentkrav}
              hasBundleError={
                !dokumentkravWithBundleError.findIndex((krav) => krav.id === dokumentkrav.id)
              }
            />
          ))}

        {noDocumentsToSave && (
          <ValidationMessage message={getAppText(ETTERSENDING_VALIDERING_INGEN_DOKUMENTER)} />
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

        <DeleteSoknadModal
          isOpen={deleteSoknadModalOpen}
          handleClose={() => setDeleteSoknadModalOpen(false)}
        />

        {(isError || error) && <ErrorRetryModal errorType={errorType} />}

        <NoSessionModal />
      </main>
    </>
  );
}
