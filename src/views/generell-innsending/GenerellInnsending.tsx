import React, { useEffect, useState } from "react";
import { Button } from "@navikt/ds-react";
import { ErrorRetryModal } from "../../components/error-retry-modal/ErrorRetryModal";
import { FetchIndicator } from "../../components/fetch-indicator/FetchIndicator";
import { NoSessionModal } from "../../components/no-session-modal/NoSessionModal";
import { PageMeta } from "../../components/PageMeta";
import { SoknadHeader } from "../../components/soknad-header/SoknadHeader";
import { Section } from "../../components/section/Section";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import useSWR from "swr";
import api from "../../api.utils";
import { IDokumentkravList } from "../../types/documentation.types";
import { useUuid } from "../../hooks/useUuid";
import { GenerellInnsendingDocument } from "./GenerellInnsendingDocument";
import { useEttersending } from "../../hooks/dokumentkrav/useEttersending";
import {
  ETTERSENDING_VALIDERING_INGEN_DOKUMENTER,
  INNSENDING_HEADER_TITTEL,
  INNSENDING_SIDE_METADATA_BESKRIVELSE,
  INNSENDING_SIDE_METADATA_TITTEL,
} from "../../text-constants";
import { usePutRequest } from "../../hooks/usePutRequest";
import { saveDokumentkravSvar } from "../../api/dokumentasjon-api";
import { DOKUMENTKRAV_SVAR_SEND_NAA } from "../../constants";
import { DeleteSoknadModal } from "../../components/exit-soknad/DeleteSoknadModal";
import { ValidationMessage } from "../../components/faktum/validation/ValidationMessage";
import styles from "./GenerellInnsending.module.css";

export function GenerellInnsending() {
  const { uuid } = useUuid();
  const { getAppText } = useSanity();
  const { soknadState, isError, isLoading, errorType } = useQuiz();
  const { unansweredFaktumId, setUnansweredFaktumId } = useValidation();
  const [deleteSoknadModalOpen, setDeleteSoknadModalOpen] = useState(false);
  const [shouldFetchDokumentkrav, setShouldFetchDokumentkrav] = useState(false);
  const { data, error } = useSWR<IDokumentkravList>(
    shouldFetchDokumentkrav ? api(`/documentation/${uuid}`) : null
  );
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
    `soknad/${uuid}/ferdigstill`
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
    if (data) {
      for (const dokumentkrav of data.krav) {
        saveDokumentkravSvar(uuid, dokumentkrav.id, { svar: DOKUMENTKRAV_SVAR_SEND_NAA });
      }
    }
  }, [data]);

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
      <SoknadHeader titleTextKey={INNSENDING_HEADER_TITTEL} />
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
            {getAppText("innsending.knapp.send-inn")}
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => setDeleteSoknadModalOpen(!deleteSoknadModalOpen)}
          >
            {getAppText("innsending.knapp.avbryt-slett")}
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
