import React, { useEffect, useState } from "react";
import { IDokumentkrav, IDokumentkravFil } from "../../types/documentation.types";
import { useSanity } from "../../context/sanity-context";
import { Loader, Button, BodyLong, Heading, Modal } from "@navikt/ds-react";
import { FileUploader } from "../file-uploader/FileUploader";
import styles from "./ReceiptUploadModal.module.css";
import { useDokumentkravRemainingFilesize } from "../../hooks/useDokumentkravRemainingFilesize";
import { FileList } from "../file-list/FileList";
import { bundleDokumentkravFiles } from "../../api/dokumentasjon-api";
import { SuccessColored, ErrorColored } from "@navikt/ds-icons";
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
  const [isSuccess, setIsSuccess] = useState(false);
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
      setIsSuccess(false);

      const response = await bundleDokumentkravFiles(uuid, props.dokumentkrav);
      if (!response.ok) {
        setIsSaving(false);
        setHasError(true);
        // eslint-disable-next-line no-console
        console.log("bundleDokumentkravFiles respone ikke OK!");
      } else {
        setIsSaving(false);
        setIsSuccess(true);
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

  return (
    <>
      <Modal open={props.modalOpen} onClose={props.closeModal} className={styles.modalContainer}>
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
            {isSuccess && <SuccessColored />}
            {isSaving && <Loader />}
            {hasError && (
              <div>
                Det gikk i dass
                <ErrorColored />
              </div>
            )}
          </div>

          <nav className="navigation-container">
            <Button variant="danger" onClick={props.closeModal}>
              Lukk
            </Button>
            {!isSuccess && (
              <Button variant="primary" onClick={bundleAndSaveDokumentkravFiles}>
                Send inn dokumenter
              </Button>
            )}

            <Button variant="primary" onClick={getDokumentkravList}>
              TEST
            </Button>
          </nav>
        </Modal.Content>
      </Modal>
    </>
  );
}
