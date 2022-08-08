import React from "react";
import styles from "./ListFiles.module.css";
import { File } from "./File";
import { UploadedFile } from "../../types/documentation.types";

interface Props {
  files: UploadedFile[];
}

export function ListFiles({ files }: Props) {
  return (
    <>
      {files.length > 0 && (
        <>
          <p>Filer ({files.length})</p>
          <ul className={styles.fileOverview}>
            {files.map((file, i) => {
              const index = `${i}-${file}`;
              return <File key={index} filnavn={file.urn} />;
            })}
          </ul>
        </>
      )}
    </>
  );
}
