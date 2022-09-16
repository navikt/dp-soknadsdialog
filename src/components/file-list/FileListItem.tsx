import React from "react";
import { BodyShort, Button, Link } from "@navikt/ds-react";
import { IDokumentkravFil } from "../../types/documentation.types";
import styles from "./FileListItem.module.css";
import api from "../../api.utils";
import { useRouter } from "next/router";
import { deleteDokumentkravFile } from "../../api/dokumentasjon-api";
import { Delete } from "@navikt/ds-icons";

interface IProps {
  file: IDokumentkravFil;
  dokumentkravId: string;
  handleUploadedFiles: (file: IDokumentkravFil) => void;
}

export function FileListItem({ file, dokumentkravId, handleUploadedFiles }: IProps) {
  const router = useRouter();
  const uuid = router.query.uuid as string;

  async function handleDeleteFile() {
    try {
      const response = await deleteDokumentkravFile(uuid, dokumentkravId, file);

      handleUploadedFiles(file);

      // eslint-disable-next-line no-console
      console.log(response);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
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
    </li>
  );
}
