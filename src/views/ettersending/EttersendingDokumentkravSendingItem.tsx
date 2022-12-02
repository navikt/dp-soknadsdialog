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
import { DokumentkravTitle } from "../../components/dokumentkrav/DokumentkravTitle";
import { Alert, Link } from "@navikt/ds-react";
import api from "../../api.utils";
import {
  ETTERSENDING_DOKUMENTER_TEKST_LAST_OPP_FLERE,
  ETTERSENDING_DOKUMENTER_TEKST_TIDLIGERE_SENDT,
  ETTERSENDING_VALIDERING_BUNDLING_FEILET,
} from "../../text-constants";
import styles from "./Ettersending.module.css";

interface IProps {
  dokumentkrav: IDokumentkrav;
  hasBundleError: boolean;
  addDokumentkrav: (dokumentkrav: IDokumentkrav) => void;
  removeDokumentkrav: (dokumentkrav: IDokumentkrav) => void;
}

export function EttersendingDokumentkravSendingItem(props: IProps) {
  const { getAppText, getDokumentkravTextById } = useSanity();
  const unbundledFiles = props.dokumentkrav.filer.filter((fil) => !fil.bundlet);
  const { uploadedFiles, handleUploadedFiles } = useFileUploader(unbundledFiles);
  const { remainingFilesize } = useDokumentkravRemainingFilesize(props.dokumentkrav);
  const dokumentkravText = getDokumentkravTextById(props.dokumentkrav.beskrivendeId);

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
    <div id={props.dokumentkrav.id} className={styles.dokumentkravContainer}>
      <EttersendingDokumentkravTitle {...props.dokumentkrav} />

      {dokumentkravText?.description && <PortableText value={dokumentkravText.description} />}
      {dokumentkravText?.helpText && (
        <HelpText className="my-6" helpText={dokumentkravText.helpText} />
      )}

      {props.dokumentkrav.bundleFilsti && (
        <div className="my-3">
          {`${getAppText(ETTERSENDING_DOKUMENTER_TEKST_TIDLIGERE_SENDT)} `}
          <Link
            href={api(`/documentation/download-file/${props.dokumentkrav.bundleFilsti}`)}
            rel="noreferrer"
            target="_blank"
          >
            <DokumentkravTitle dokumentkrav={props.dokumentkrav} />
          </Link>
          {`. ${getAppText(ETTERSENDING_DOKUMENTER_TEKST_LAST_OPP_FLERE)} `}
        </div>
      )}

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
    </div>
  );
}
