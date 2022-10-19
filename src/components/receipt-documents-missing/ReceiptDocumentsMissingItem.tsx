import React, { useState } from "react";
import styles from "./ReceiptDocumentsMissing.module.css";
import { BodyShort, Button, Heading, ReadMore } from "@navikt/ds-react";
import {
  DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE,
  DOKUMENTKRAV_SVAR_SENDER_SENERE,
} from "../../constants";
import { PortableText } from "@portabletext/react";
import { UploadFilesModal } from "../upload-modal/UploadModal";
import { IDokumentkrav } from "../../types/documentation.types";
import { useSanity } from "../../context/sanity-context";

export function ReceiptDocumentsMissingItem(dokumentkrav: IDokumentkrav) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const { getAppText, getDokumentkravTextById } = useSanity();

  const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);

  function toggleModal() {
    setUploadModalOpen((state) => !state);
  }

  return (
    <div className={styles.dokumentkrav}>
      <Heading level="3" size="xsmall">
        {dokumentkravText?.title ? dokumentkravText.title : dokumentkrav.beskrivendeId}
      </Heading>
      <BodyShort>
        <>
          {dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NOEN_ANDRE && (
            <>{getAppText("kvittering.tekst.skal-sendes-av.noen-andre")}</>
          )}
          {dokumentkrav.svar === DOKUMENTKRAV_SVAR_SENDER_SENERE && (
            <>{getAppText("kvittering.tekst.skal-sendes-av.deg")}</>
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
        closeModal={() => setUploadModalOpen(false)}
      />
    </div>
  );
}
