import React, { useState } from "react";
import styles from "./ReceiptDocumentsMissing.module.css";
import { BodyShort, Button, Heading, ReadMore } from "@navikt/ds-react";
import {
  DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE,
  DOKUMENTKRAV_SVAR_SENDER_SENERE,
} from "../../constants";
import { PortableText } from "@portabletext/react";
import { UploadFilesModal } from "../receipt-upload-modal/ReceiptUploadModal";
import { IDokumentkrav } from "../../types/documentation.types";
import { useSanity } from "../../context/sanity-context";
import { useFileUploader } from "../../hooks/useFileUploader";
import { FileList } from "../file-list/FileList";

export function ReceiptDocumentsMissingItem(dokumentkrav: IDokumentkrav) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const { getAppTekst, getDokumentkravTextById } = useSanity();
  const { uploadedFiles, handleUploadedFiles } = useFileUploader();

  const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);

  function toggleModal() {
    setUploadModalOpen((state) => !state);
  }

  return (
    <div className={styles.dokumentkrav}>
      <Heading level="3" size="xsmall">
        {dokumentkravText?.text ? dokumentkravText.text : dokumentkrav.beskrivendeId}
      </Heading>
      <BodyShort>
        <>
          {dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE && (
            <>{getAppTekst("kvittering.text.skal-sendes-av.noen-andre")}</>
          )}
          {dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDER_SENERE && (
            <>{getAppTekst("kvittering.text.skal-sendes-av.deg")}</>
          )}
        </>
      </BodyShort>

      {dokumentkravText?.helpText && (
        <ReadMore header={dokumentkravText?.helpText?.title}>
          {dokumentkravText?.helpText?.body && (
            <PortableText value={dokumentkravText.helpText.body} />
          )}
        </ReadMore>
      )}

      <Button className={styles.uploadButton} onClick={toggleModal}>
        Last opp
      </Button>

      <UploadFilesModal
        modalOpen={uploadModalOpen}
        dokumentkrav={dokumentkrav}
        handleUploadedFiles={handleUploadedFiles}
        closeModal={() => setUploadModalOpen(false)}
      />

      <FileList
        uploadedFiles={uploadedFiles}
        dokumentkravId={dokumentkrav.beskrivendeId}
        handleUploadedFiles={handleUploadedFiles}
      />
    </div>
  );
}
