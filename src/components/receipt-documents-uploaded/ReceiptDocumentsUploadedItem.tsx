import React, { useState } from "react";
import { BodyShort, Button, Link } from "@navikt/ds-react";
import { IDokumentkrav } from "../../types/documentation.types";
import { useSanity } from "../../context/sanity-context";
import { UploadFilesModal } from "../upload-modal/UploadModal";
import api from "../../api.utils";
import styles from "./ReceiptDocumentsUploaded.module.css";

interface IProps {
  dokumentkrav: IDokumentkrav;
}

export function ReceiptDocumentsUploadedItem({ dokumentkrav }: IProps) {
  const { getAppText, getDokumentkravTextById } = useSanity();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const dokumentkravText = getDokumentkravTextById(dokumentkrav.beskrivendeId);

  function toggleModal() {
    setUploadModalOpen((state) => !state);
  }

  return (
    <div className={styles.documentItem}>
      <div>
        <Link
          href={api(`/documentation/download/${dokumentkrav.bundleFilsti}`)}
          rel="noreferrer"
          target="_blank"
        >
          {dokumentkravText?.title ? dokumentkravText.title : dokumentkrav.beskrivendeId}
        </Link>
        <BodyShort>{getAppText("kvittering.tekst.sendt-av-deg")}</BodyShort>
      </div>

      <Button className={styles.uploadButton} onClick={toggleModal}>
        Last opp igjen
      </Button>

      <UploadFilesModal
        modalOpen={uploadModalOpen}
        dokumentkrav={dokumentkrav}
        closeModal={() => setUploadModalOpen(false)}
      />
    </div>
  );
}
