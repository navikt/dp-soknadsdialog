import React, { useState } from "react";
import { BodyShort, Button, Link } from "@navikt/ds-react";
import { IDokumentkravFil } from "../../types/documentation.types";
import styles from "./FileListItem.module.css";
import api from "../../api.utils";
import { useRouter } from "next/router";
import { deleteDokumentkravFile } from "../../api/dokumentasjon-api";
import { Delete } from "@navikt/ds-icons";
import { ErrorRetryModal } from "../error-retry-modal/ErrorRetryModal";
import { ErrorTypesEnum } from "../../types/error.types";

interface IProps {
  file: IDokumentkravFil;
  dokumentkravId: string;
  handleUploadedFiles: (file: IDokumentkravFil) => void;
}

export function FileListItem({ file, dokumentkravId, handleUploadedFiles }: IProps) {
  const router = useRouter();
  const uuid = router.query.uuid as string;

  const [hasError, setHasError] = useState(false);

  async function handleDeleteFile() {
    try {
      const response = await deleteDokumentkravFile(uuid, dokumentkravId, file);

      if (!response.ok) {
        throw Error(response.statusText);
      }

      handleUploadedFiles(file);
    } catch (error) {
      setHasError(true);
    }
  }

  return (
    <li className={styles.fileItem}>
      <div>
        <Link href={api(`/documentation/${file.filsti}/download`)} download={file.filnavn}>
          <BodyShort size="medium">{file.filnavn}</BodyShort>
        </Link>
        <BodyShort className={styles.uploadedText} size="small">
          Lastet opp
        </BodyShort>
      </div>
      <Button className={styles.deleteButton} variant="tertiary" onClick={handleDeleteFile}>
        <Delete />
        Slett fil
      </Button>
      {hasError && <ErrorRetryModal errorType={ErrorTypesEnum.GenericError} />}
    </li>
  );
}
