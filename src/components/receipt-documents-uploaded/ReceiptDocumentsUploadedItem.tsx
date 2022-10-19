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
  const { getAppTekst } = useSanity();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

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
        closeModal={() => setUploadModalOpen(false)}
      />
    </div>
  );
}
