import React from "react";
import styles from "./FileList.module.css";
import { FileItem } from "./FileItem";
import { UploadedFile, FileState } from "../../types/documentation.types";

interface Props {
  previouslyUploaded: UploadedFile[];
  handledFiles: FileState[];
}

export function FileList({ previouslyUploaded, handledFiles }: Props) {
  return (
    <>
      {previouslyUploaded.length > 0 && (
        <>
          <p>Allerede opplastede filer</p>
          <ul className={styles.fileList}>
            {previouslyUploaded.map((file) => {
              return (
                <li key={file.urn}>
                  <FileItem key={file.urn} id={file.urn} name={file.urn} state="UPLOADED" />
                </li>
              );
            })}
          </ul>
        </>
      )}

      {handledFiles.length > 0 && (
        <>
          <p>Nye filer</p>
          <ul className={styles.fileList}>
            {handledFiles.map((file) => {
              return (
                <li key={file.id}>
                  <FileItem
                    key={file.id}
                    id={file.id}
                    name={file.name}
                    state={file.state}
                    error={file.error}
                  />
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}
