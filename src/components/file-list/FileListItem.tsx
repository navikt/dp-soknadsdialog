import React from "react";
import { BodyShort, Button, Link } from "@navikt/ds-react";
import { IDokumentkravFil } from "../../types/documentation.types";
import styles from "./FileListItem.module.css";
import api from "../../api.utils";
import { useRouter } from "next/router";
import { deleteDokumentkravFile } from "../../api/dokumentasjon-api";

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
      <Link href={api(`/documentation/${file.filsti}/download`)} download={file.filnavn}>
        <BodyShort size="medium">{file.filnavn}</BodyShort>
      </Link>
      <Link href={api(`/documentation/file/${file.filsti}/download`)} download={file.filnavn}>
        Gammel download
      </Link>
      <Button onClick={handleDeleteFile}>Slett fil</Button>
    </li>
  );
}
