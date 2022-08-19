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
  const uploadedLength = previouslyUploaded.length + handledFiles.length;

  return (
    <>
      {uploadedLength > 0 && (
        <>
          <Detail uppercase>Filer ({uploadedLength})</Detail>
          <ul className={styles.fileList}>
            {previouslyUploaded.map((file) => (
              <FileItem
                key={file.urn}
                id={file.urn}
                name={file.filnavn}
                state={FileHandleState.Uploaded}
              />
            ))}

            {handledFiles.map((file) => (
              <FileItem
                key={file.id}
                id={file.id}
                name={file.name}
                state={file.state}
                error={file.error}
              />
            ))}
          </ul>
        </>
      )}
    </>
  );
}
