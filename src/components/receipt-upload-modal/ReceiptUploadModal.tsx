import React, { useEffect, useState } from "react";
import { IDokumentkrav, IDokumentkravFil } from "../../types/documentation.types";
import { useSanity } from "../../context/sanity-context";
import { Alert, BodyLong, Button, Heading, Loader, Modal } from "@navikt/ds-react";
import { FileUploader } from "../file-uploader/FileUploader";
import styles from "./ReceiptUploadModal.module.css";
import { useDokumentkravRemainingFilesize } from "../../hooks/useDokumentkravRemainingFilesize";
import { FileList } from "../file-list/FileList";
import { bundleDokumentkravFiles } from "../../api/dokumentasjon-api";
import { useRouter } from "next/router";
import { useDokumentkrav } from "../../context/dokumentkrav-context";

interface IProps {
  modalOpen: boolean;
  closeModal: () => void;
  dokumentkrav: IDokumentkrav;
  uploadedFiles: IDokumentkravFil[];
  handleUploadedFiles: (file: IDokumentkravFil) => void;
}

export function UploadFilesModal(props: IProps) {
  const router = useRouter();
  const uuid = router.query.uuid as string;
  const [isSaving, setIsSaving] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isFilesUploaded, setIsFilesUploaded] = useState(false);
  const { getDokumentkravTextById } = useSanity();
  const { getDokumentkravList } = useDokumentkrav();
  const { remainingFilesize } = useDokumentkravRemainingFilesize(props.dokumentkrav);
  const dokumentkravText = getDokumentkravTextById(props.dokumentkrav.beskrivendeId);

  useEffect(() => {
    if (Modal.setAppElement) {
      Modal.setAppElement("#__next");
    }
  }, []);

  async function bundleAndSaveDokumentkravFiles() {
    try {
      setIsSaving(true);
      setHasError(false);
      setIsFilesUploaded(false);

      const dokumentkravWithUploadedFiles = { ...props.dokumentkrav, files: props.uploadedFiles };
      const response = await bundleDokumentkravFiles(uuid, dokumentkravWithUploadedFiles);

      if (!response.ok) {
        setIsSaving(false);
        setHasError(true);
        // eslint-disable-next-line no-console
        console.log("bundleDokumentkravFiles respone ikke OK!");
      } else {
        setIsSaving(false);
        setIsFilesUploaded(true);
      }
      // eslint-disable-next-line no-console
      console.log(response.status);
    } catch (error) {
      setIsSaving(false);
      setHasError(true);
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  function toggleModal() {
    if (isFilesUploaded) {
      getDokumentkravList();
    }
    props.closeModal();
  }

  return (
    <>
      <Modal open={props.modalOpen} onClose={toggleModal} className={styles.modalContainer}>
        <Modal.Content>
          <Heading spacing level="1" size="medium" id="modal-heading">
            Last opp filer
          </Heading>
          <Heading spacing level="2" size="small">
            {dokumentkravText?.text ? dokumentkravText.text : props.dokumentkrav.beskrivendeId}
          </Heading>
          <BodyLong>
            <>
              {dokumentkravText?.description
                ? dokumentkravText.description
                : props.dokumentkrav.beskrivendeId}
            </>
          </BodyLong>

          {!isFilesUploaded && (
            <>
              <FileUploader
                dokumentkrav={props.dokumentkrav}
                handleUploadedFiles={props.handleUploadedFiles}
                maxFileSize={remainingFilesize}
              />

              <FileList
                uploadedFiles={props.uploadedFiles}
                dokumentkravId={props.dokumentkrav.beskrivendeId}
                handleUploadedFiles={props.handleUploadedFiles}
              />

              <div>
                {isSaving && <Loader />}
                {hasError && <Alert variant="error">Det gikk i dass.</Alert>}
              </div>

              <nav className="navigation-container">
                <>
                  <Button variant="primary" onClick={bundleAndSaveDokumentkravFiles}>
                    Send inn dokumenter
                  </Button>
                  <Button variant="secondary" onClick={props.closeModal}>
                    Avbryt
                  </Button>
                </>
              </nav>
            </>
          )}

          {isFilesUploaded && (
            <>
              <Alert variant="success">
                Filene dine er lagret
                <ul>
                  {props.uploadedFiles.map((file) => (
                    <li key={file.filsti}>{file.filnavn}</li>
                  ))}
                </ul>
              </Alert>

              <Button variant="primary" onClick={toggleModal}>
                Lukk
              </Button>
            </>
          )}
        </Modal.Content>
      </Modal>
    </>
  );
}
