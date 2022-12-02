import React from "react";
import { BodyShort, Button, Link } from "@navikt/ds-react";
import { IDokumentkravFil } from "../../types/documentation.types";
import styles from "./FileListItem.module.css";
import api from "../../api.utils";
import { Delete } from "@navikt/ds-icons";
import { ErrorRetryModal } from "../error-retry-modal/ErrorRetryModal";
import { ErrorTypesEnum } from "../../types/error.types";
import { useDeleteRequest } from "../../hooks/useDeleteRequest";
import { useUuid } from "../../hooks/useUuid";
import { IDeleteFileBody } from "../../pages/api/documentation/file/delete";
import { useSanity } from "../../context/sanity-context";

interface IProps {
  file: IDokumentkravFil;
  dokumentkravId: string;
  handleUploadedFiles: (file: IDokumentkravFil) => void;
}

export function FileListItem({ file, dokumentkravId, handleUploadedFiles }: IProps) {
  const { uuid } = useUuid();
  const { getAppText } = useSanity();
  const [deleteFile, deleteFileStatus] = useDeleteRequest<IDeleteFileBody>(
    "documentation/file/delete"
  );

  async function handleDeleteFile() {
    const responseOk = await deleteFile({ uuid, dokumentkravId, filsti: file.filsti });

    if (responseOk) {
      handleUploadedFiles(file);
    }
  }

  return (
    <li className={styles.fileItem}>
      <div>
        <Link
          href={api(`/documentation/download-file/${file.filsti}`)}
          download={file.filnavn}
          id={file.filsti}
        >
          <BodyShort size="medium">{file.filnavn}</BodyShort>
        </Link>
        <BodyShort className={styles.uploadedText} size="small">
          {getAppText("dokumentkrav.filopplaster.text.lastet-opp")}
        </BodyShort>
      </div>
      <Button
        variant="tertiary"
        onClick={handleDeleteFile}
        aria-describedby={file.filsti}
        className={styles.deleteButton}
        loading={deleteFileStatus === "pending"}
      >
        <Delete />
        {getAppText("dokumentkrav.filopplaster.text.slett-fil")}
      </Button>
      {deleteFileStatus === "error" && <ErrorRetryModal errorType={ErrorTypesEnum.GenericError} />}
    </li>
  );
}
