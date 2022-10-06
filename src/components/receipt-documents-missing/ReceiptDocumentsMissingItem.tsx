import React, { useState } from "react";
import styles from "./ReceiptDocumentsMissing.module.css";
import { BodyShort, Button, Heading, ReadMore } from "@navikt/ds-react";
import {
  DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE,
  DOKUMENTKRAV_SVAR_SENDER_SENERE,
} from "../../constants";
import { PortableText } from "@portabletext/react";
import { UploadFilesModal } from "../receipt-upload-modal/ReceiptUploadModal";
import { IDokumentkrav, IDokumentkravFil } from "../../types/documentation.types";
import { useSanity } from "../../context/sanity-context";

export function ReceiptDocumentsMissingItem(dokumentkrav: IDokumentkrav) {
  const { getAppTekst, getDokumentkravTextById } = useSanity();
  const [uploadedFiles, setUploadedFiles] = useState<IDokumentkravFil[]>([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);

  function toggleModal() {
    setUploadModalOpen((state) => !state);
  }

  function handUploadedFiles(file: IDokumentkravFil) {
    const fileState = [...uploadedFiles];
    const indexOfFile = fileState.findIndex((f) => f.filsti === file.filsti);

    if (indexOfFile !== -1) {
      fileState.splice(indexOfFile, 1);
      setUploadedFiles(fileState);
    } else {
      setUploadedFiles((currentState) => [...currentState, file]);
    }
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
        handleUploadedFiles={handUploadedFiles}
        closeModal={() => setUploadModalOpen(false)}
      />
    </div>
  );
}
