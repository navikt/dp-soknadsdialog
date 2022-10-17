import React, { useState } from "react";
import { IDokumentkrav } from "../../types/documentation.types";
import { useSanity } from "../../context/sanity-context";
import { useFileUploader } from "../../hooks/useFileUploader";
import styles from "./ReceiptDocumentsUploaded.module.css";
import { Link, BodyShort, Button } from "@navikt/ds-react";
import api from "../../api.utils";
import { UploadFilesModal } from "../receipt-upload-modal/ReceiptUploadModal";

interface IProps {
  dokumentkrav: IDokumentkrav;
}

export function ReceiptDocumentsUploadedItem({ dokumentkrav }: IProps) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const { getAppTekst } = useSanity();
  const { uploadedFiles, handleUploadedFiles } = useFileUploader();

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
          {dokumentkrav.beskrivendeId}
        </Link>
        {dokumentkrav.filer[0]?.tidspunkt && (
          <BodyShort>
            {`${getAppTekst("kvittering.tekst.sendt-av")} ${dokumentkrav.filer[0].tidspunkt}`}
          </BodyShort>
        )}
      </div>

      <Button className={styles.uploadButton} onClick={toggleModal}>
        Last opp igjen
      </Button>

      <UploadFilesModal
        modalOpen={uploadModalOpen}
        dokumentkrav={dokumentkrav}
        uploadedFiles={uploadedFiles}
        handleUploadedFiles={handleUploadedFiles}
        closeModal={() => setUploadModalOpen(false)}
      />
    </div>
  );
}
