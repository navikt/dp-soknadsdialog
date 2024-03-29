import React from "react";
import { useDokumentkravRemainingFilesize } from "../../hooks/useDokumentkravRemainingFilesize";
import { useFileUploader } from "../../hooks/useFileUploader";
import { IDokumentkrav } from "../../types/documentation.types";
import { PortableText } from "@portabletext/react";
import { FileUploader } from "../../components/file-uploader/FileUploader";
import { useSanity } from "../../context/sanity-context";
import { FileList } from "../../components/file-list/FileList";
import { HelpText } from "../../components/HelpText";
import { EttersendingDokumentkravTitle } from "./EttersendingDokumentkravTitle";
import { DokumentkravTitle } from "../../components/dokumentkrav-title/DokumentkravTitle";
import { Alert, Link } from "@navikt/ds-react";
import api from "../../utils/api.utils";
import styles from "./Ettersending.module.css";
import { DOKUMENTKRAV_SVAR_SEND_NAA } from "../../constants";

interface IProps {
  dokumentkrav: IDokumentkrav;
  hasBundleError: boolean;
}

export function EttersendingDokumentkravSendingItem(props: IProps) {
  const { getAppText, getDokumentkravTextById } = useSanity();
  const unbundledFiles = props.dokumentkrav.filer.filter((fil) => !fil.bundlet);
  const { uploadedFiles, handleUploadedFiles } = useFileUploader(unbundledFiles);
  const { remainingFilesize } = useDokumentkravRemainingFilesize(props.dokumentkrav);
  const dokumentkravText = getDokumentkravTextById(props.dokumentkrav.beskrivendeId);
  const hasBundle =
    props.dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NAA && !!props.dokumentkrav.bundleFilsti;

  return (
    <div id={props.dokumentkrav.id} className={styles.dokumentkravContainer}>
      <EttersendingDokumentkravTitle {...props.dokumentkrav} />

      {dokumentkravText?.description && <PortableText value={dokumentkravText.description} />}
      {dokumentkravText?.helpText && (
        <HelpText className="my-6" helpText={dokumentkravText.helpText} />
      )}

      {hasBundle && (
        <div className="my-3">
          {`${getAppText("ettersending.dokumenter.tekst.tidligere.sendt")} `}
          <Link
            href={api(`/documentation/download/${props.dokumentkrav.bundleFilsti}`)}
            rel="noreferrer"
            target="_blank"
          >
            <DokumentkravTitle dokumentkrav={props.dokumentkrav} />
          </Link>
          {`. ${getAppText("ettersending.dokumenter.tekst.last-opp-flere")} `}
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
        <Alert variant={"error"}>{getAppText("ettersending.validering.bundling-feilet")}</Alert>
      )}
    </div>
  );
}
