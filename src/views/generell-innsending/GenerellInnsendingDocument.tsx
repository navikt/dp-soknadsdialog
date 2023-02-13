import React from "react";
import { IDokumentkrav } from "../../types/documentation.types";
import { useSanity } from "../../context/sanity-context";
import { useFileUploader } from "../../hooks/useFileUploader";
import { useDokumentkravRemainingFilesize } from "../../hooks/useDokumentkravRemainingFilesize";
import { FileUploader } from "../../components/file-uploader/FileUploader";
import { FileList } from "../../components/file-list/FileList";
import { Alert } from "@navikt/ds-react";

interface IProps {
  dokumentkrav: IDokumentkrav;
  hasBundleError: boolean;
}

export function GenerellInnsendingDocument(props: IProps) {
  const { dokumentkrav, hasBundleError } = props;
  const { getAppText } = useSanity();
  const unbundledFiles = dokumentkrav.filer.filter((fil) => !fil.bundlet);
  const { uploadedFiles, handleUploadedFiles } = useFileUploader(unbundledFiles);
  const { remainingFilesize } = useDokumentkravRemainingFilesize(dokumentkrav);

  return (
    <>
      <FileUploader
        dokumentkrav={dokumentkrav}
        maxFileSize={remainingFilesize}
        handleUploadedFiles={handleUploadedFiles}
      />

      <FileList
        dokumentkravId={dokumentkrav.id}
        uploadedFiles={uploadedFiles}
        handleUploadedFiles={handleUploadedFiles}
      />

      {hasBundleError && (
        <Alert variant={"error"}>{getAppText("ettersending.validering.bundling-feilet")}</Alert>
      )}
    </>
  );
}
