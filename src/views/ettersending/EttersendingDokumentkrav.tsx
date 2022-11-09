import React, { useEffect } from "react";
import { useDokumentkravRemainingFilesize } from "../../hooks/useDokumentkravRemainingFilesize";
import { useFileUploader } from "../../hooks/useFileUploader";
import { IDokumentkrav } from "../../types/documentation.types";
import { PortableText } from "@portabletext/react";
import { FileUploader } from "../../components/file-uploader/FileUploader";
import { useSanity } from "../../context/sanity-context";
import { FileList } from "../../components/file-list/FileList";
import { HelpText } from "../../components/HelpText";
import { EttersendingDokumentkravTitle } from "./EttersendingDokumentkravTitle";
import styles from "./EttersendingDokumentkrav.module.css";

interface IProps {
  dokumentkrav: IDokumentkrav;
  updateDokumentkrav: (dokumentkrav: IDokumentkrav) => void;
}

export function EttersendingDokumentkrav(props: IProps) {
  const { getDokumentkravTextById } = useSanity();
  const { uploadedFiles, handleUploadedFiles } = useFileUploader();
  const { remainingFilesize } = useDokumentkravRemainingFilesize(props.dokumentkrav);
  const dokumentkravText = getDokumentkravTextById(props.dokumentkrav.beskrivendeId);

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      props.updateDokumentkrav({
        ...props.dokumentkrav,
        filer: [...props.dokumentkrav.filer, ...uploadedFiles],
      });
    }
  }, [uploadedFiles.length]);

  return (
    <div id={props.dokumentkrav.id} className={styles.dokumentkravContainer}>
      <EttersendingDokumentkravTitle {...props.dokumentkrav} />

      {dokumentkravText?.description && <PortableText value={dokumentkravText.description} />}
      {dokumentkravText?.helpText && (
        <HelpText className="my-6" helpText={dokumentkravText.helpText} />
      )}

      <FileUploader
        dokumentkrav={props.dokumentkrav}
        maxFileSize={remainingFilesize}
        handleUploadedFiles={handleUploadedFiles}
      />

      <FileList
        dokumentkravId={props.dokumentkrav.beskrivendeId}
        uploadedFiles={uploadedFiles}
        handleUploadedFiles={handleUploadedFiles}
      />
    </div>
  );
}
