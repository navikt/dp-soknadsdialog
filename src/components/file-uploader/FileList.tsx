import React from "react";
import styles from "./FileList.module.css";
import { FileItem } from "./FileItem";
import { UploadedFile, FileState } from "../../types/documentation.types";
import { Detail } from "@navikt/ds-react";

interface Props {
  previouslyUploaded: UploadedFile[];
  handledFiles: FileState[];
}

export function FileList({ previouslyUploaded, handledFiles }: Props) {
  const uploadedLength = previouslyUploaded.length + handledFiles.length;

  return (
    <>
      {uploadedLength > 0 && (
        <>
          <Detail uppercase>Filer ({uploadedLength})</Detail>
          <ul className={styles.fileList}>
            {previouslyUploaded.map((file) => {
              return <FileItem key={file.urn} id={file.urn} name={file.filnavn} state="UPLOADED" />;
            })}

            {handledFiles.length > 0 && (
              <>
                {handledFiles.map((file) => {
                  return (
                    <FileItem
                      key={file.id}
                      id={file.id}
                      name={file.name}
                      state={file.state}
                      error={file.error}
                    />
                  );
                })}
              </>
            )}
          </ul>
        </>
      )}
    </>
  );
}
