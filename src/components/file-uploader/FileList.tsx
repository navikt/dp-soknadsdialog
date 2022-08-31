import React from "react";
import styles from "./FileList.module.css";
import { FileItem } from "./FileItem";
import { IFileState, FileHandleState, IDokumentkravFil } from "../../types/documentation.types";
import { Detail } from "@navikt/ds-react";

interface IProps {
  previouslyUploaded: IDokumentkravFil[];
  handledFiles: IFileState[];
}

export function FileList({ previouslyUploaded, handledFiles }: IProps) {
  const numberOfUploadedFiles = previouslyUploaded.length + handledFiles.length;

  return (
    <>
      {numberOfUploadedFiles > 0 && (
        <>
          <Detail uppercase>Filer ({numberOfUploadedFiles})</Detail>
          <ul className={styles.fileList}>
            {previouslyUploaded.map((file) => (
              <FileItem
                key={file.urn}
                id={file.urn}
                name={file.filnavn}
                state={FileHandleState.Uploaded}
                filsti={file.filsti}
              />
            ))}

            {handledFiles.map((file) => (
              <FileItem key={file.id} {...file} />
            ))}
          </ul>
        </>
      )}
    </>
  );
}
