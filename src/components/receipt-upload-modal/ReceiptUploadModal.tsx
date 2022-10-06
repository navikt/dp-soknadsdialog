import { IDokumentkrav, IDokumentkravFil } from "../../types/documentation.types";
import { useSanity } from "../../context/sanity-context";
import React, { useEffect } from "react";
import { BodyLong, Heading, Modal } from "@navikt/ds-react";
import { FileUploader } from "../file-uploader/FileUploader";

interface IProps {
  modalOpen: boolean;
  closeModal: () => void;
  dokumentkrav: IDokumentkrav;
  handleUploadedFiles: (file: IDokumentkravFil) => void;
}

export function UploadFilesModal(props: IProps) {
  const { getDokumentkravTextById } = useSanity();
  const dokumentkravText = getDokumentkravTextById(props.dokumentkrav.beskrivendeId);

  useEffect(() => {
    if (Modal.setAppElement) {
      Modal.setAppElement("#__next");
    }
  }, []);

  return (
    <>
      <Modal open={props.modalOpen} onClose={props.closeModal}>
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
            maxFileSize={10000}
          />
        </Modal.Content>
      </Modal>
    </>
  );
}
