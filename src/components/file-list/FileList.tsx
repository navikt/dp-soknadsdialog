import React from "react";
import styles from "./FileList.module.css";
import { FileListItem } from "./FileListItem";
import { IDokumentkravFil } from "../../types/documentation.types";
import { Detail } from "@navikt/ds-react";

interface IProps {
  uploadedFiles: IDokumentkravFil[];
}

export function FileList({ uploadedFiles }: IProps) {
  return (
    <>
      {uploadedFiles.length > 0 && (
        <>
          <Detail uppercase>Filer ({uploadedFiles.length})</Detail>
          <ul className={styles.fileList}>
            {uploadedFiles.map((file) => (
              <FileListItem key={file.filsti} {...file} />
            ))}
          </ul>
        </>
      )}
    </>
  );
}
