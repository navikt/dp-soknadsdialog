import React, { useEffect, useState } from "react";
import { Alert, BodyLong, Button, Heading, Modal } from "@navikt/ds-react";
import { IDokumentkrav } from "../../types/documentation.types";
import { useSanity } from "../../context/sanity-context";
import { FileUploader } from "../file-uploader/FileUploader";
import { useDokumentkravRemainingFilesize } from "../../hooks/useDokumentkravRemainingFilesize";
import { FileList } from "../file-list/FileList";
import { bundleDokumentkravFiles } from "../../api/dokumentasjon-api";
import { useRouter } from "next/router";
import { useDokumentkrav } from "../../context/dokumentkrav-context";
import { useFileUploader } from "../../hooks/useFileUploader";
import styles from "./UploadModal.module.css";

interface IProps {
  modalOpen: boolean;
  closeModal: () => void;
  dokumentkrav: IDokumentkrav;
}

type IErrorState = "MISSING_FILES" | "BUNDLE_ERROR";

export function UploadFilesModal(props: IProps) {
  const router = useRouter();
  const uuid = router.query.uuid as string;
  const [error, setError] = useState<IErrorState | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const [bundleFilesSuccess, setBundleFilesSuccess] = useState(false);

  const { getDokumentkravTextById } = useSanity();
  const { getDokumentkravList } = useDokumentkrav();
  const { remainingFilesize } = useDokumentkravRemainingFilesize(props.dokumentkrav);
  const { uploadedFiles, handleUploadedFiles, resetUploadFiles } = useFileUploader();

  const dokumentkravText = getDokumentkravTextById(props.dokumentkrav.beskrivendeId);
  const unbundledFiles = props.dokumentkrav.filer.filter((file) => !file.bundlet);

  useEffect(() => {
    if (Modal.setAppElement) {
      Modal.setAppElement("#__next");
    }
  }, []);

  useEffect(() => {
    if (error === "MISSING_FILES" && uploadedFiles.length > 0) {
      setError(undefined);
    }
  }, [uploadedFiles.length]);

  async function bundleAndSaveDokumentkravFiles() {
    if (unbundledFiles.length === 0 && uploadedFiles.length === 0) {
      setError("MISSING_FILES");
      return;
    }

    try {
      setIsSaving(true);
      setError(undefined);
      setBundleFilesSuccess(false);

      const dokumentkravWithUploadedFiles: IDokumentkrav = {
        ...props.dokumentkrav,
        filer: [...props.dokumentkrav.filer, ...uploadedFiles],
      };

      const response = await bundleDokumentkravFiles(uuid, dokumentkravWithUploadedFiles);

      if (!response.ok) {
        setIsSaving(false);
        setError("BUNDLE_ERROR");
        // eslint-disable-next-line no-console
        console.log("bundleDokumentkravFiles respone ikke OK!");
      } else {
        setIsSaving(false);
        setBundleFilesSuccess(true);
      }
      // eslint-disable-next-line no-console
      console.log(response.status);
    } catch (error) {
      setIsSaving(false);
      setError("BUNDLE_ERROR");
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  function toggleModal() {
    if (bundleFilesSuccess) {
      resetUploadFiles();
      getDokumentkravList();
      setBundleFilesSuccess(false);
    }

    if (error) {
      resetUploadFiles();
      setError(undefined);
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
            {dokumentkravText?.title ? dokumentkravText.title : props.dokumentkrav.beskrivendeId}
          </Heading>
          <BodyLong>
            <>
              {dokumentkravText?.description
                ? dokumentkravText.description
                : props.dokumentkrav.beskrivendeId}
            </>
          </BodyLong>

          {!bundleFilesSuccess && (
            <>
              <FileUploader
                dokumentkrav={props.dokumentkrav}
                handleUploadedFiles={handleUploadedFiles}
                maxFileSize={remainingFilesize}
              />

              <FileList
                uploadedFiles={[...unbundledFiles, ...uploadedFiles]}
                dokumentkravId={props.dokumentkrav.beskrivendeId}
                handleUploadedFiles={handleUploadedFiles}
              />

              {error === "BUNDLE_ERROR" && (
                <Alert variant="error" className={styles.alertContainer}>
                  Klarte ikke bundle filer
                </Alert>
              )}

              {error === "MISSING_FILES" && (
                <Alert variant="error" className={styles.alertContainer}>
                  Du må laste opp filer
                </Alert>
              )}

              <nav className="navigation-container">
                <>
                  <Button
                    variant="primary"
                    loading={isSaving}
                    onClick={bundleAndSaveDokumentkravFiles}
                  >
                    Send inn dokumenter
                  </Button>
                  <Button variant="secondary" onClick={toggleModal}>
                    Avbryt
                  </Button>
                </>
              </nav>
            </>
          )}

          {bundleFilesSuccess && (
            <>
              <Alert variant="success" className={styles.alertContainer}>
                Filene dine er lagret
                <ul className={styles.uploadedFilesList}>
                  {uploadedFiles.map((file) => (
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
