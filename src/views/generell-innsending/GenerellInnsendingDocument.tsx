import React, { useEffect } from "react";
import { IDokumentkrav } from "../../types/documentation.types";
import { useSanity } from "../../context/sanity-context";
import { useFileUploader } from "../../hooks/useFileUploader";
import { useDokumentkravRemainingFilesize } from "../../hooks/useDokumentkravRemainingFilesize";
import { FileUploader } from "../../components/file-uploader/FileUploader";
import { FileList } from "../../components/file-list/FileList";
import { Alert } from "@navikt/ds-react";
import { ETTERSENDING_VALIDERING_BUNDLING_FEILET } from "../../text-constants";

interface IProps {
  dokumentkrav: IDokumentkrav;
  hasBundleError: boolean;
  addDokumentkrav: (dokumentkrav: IDokumentkrav) => void;
  removeDokumentkrav: (dokumentkrav: IDokumentkrav) => void;
}

export function GenerellInnsendingDocument(props: IProps) {
  const { getAppText } = useSanity();
  const unbundledFiles = props.dokumentkrav.filer.filter((fil) => !fil.bundlet);
  const { uploadedFiles, handleUploadedFiles } = useFileUploader(unbundledFiles);
  const { remainingFilesize } = useDokumentkravRemainingFilesize(props.dokumentkrav);

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      props.addDokumentkrav({
        ...props.dokumentkrav,
        filer: [...props.dokumentkrav.filer, ...uploadedFiles],
      });
    } else {
      props.removeDokumentkrav(props.dokumentkrav);
    }
  }, [uploadedFiles.length]);

  return (
    <>
      <FileUploader
        dokumentkrav={props.dokumentkrav}
        maxFileSize={remainingFilesize}
        handleUploadedFiles={handleUploadedFiles}
      />

      <FileList
        dokumentkravId={props.dokumentkrav.id}
        uploadedFiles={uploadedFiles}
        handleUploadedFiles={handleUploadedFiles}
      />

      {props.hasBundleError && (
        <Alert variant={"error"}>{getAppText(ETTERSENDING_VALIDERING_BUNDLING_FEILET)}</Alert>
      )}
    </>
  );
}
