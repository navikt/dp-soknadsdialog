import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@navikt/ds-react";
import { IDokumentkravFil } from "../../types/documentation.types";
import { useRouter } from "next/router";
import { saveDokumenkravFile } from "../../api/dokumentasjon-api";
import styles from "./FileUploader.module.css";

const ALLOWED_FILE_FORMATS = ["image/png", "image/jpg", "image/jpeg", "application/pdf"];
const MAX_FILE_SIZE = 52428800; // 400mb

interface IProps {
  dokumentkravId: string;
  setUploadedFiles: (file: IDokumentkravFil) => void;
}

export function FileUploaderV2({ dokumentkravId, setUploadedFiles }: IProps) {
  const router = useRouter();
  const uuid = router.query.uuid as string;

  const onDrop = useCallback((selectedFiles: File[]) => {
    selectedFiles.forEach(async (file) => {
      if (!ALLOWED_FILE_FORMATS.includes(file.type)) {
        console.error("Ugyldig filformat");
      } else if (file.size > MAX_FILE_SIZE) {
        console.error("for stor fil");
      } else {
        try {
          const fileResponse = await saveDokumenkravFile(file, uuid, dokumentkravId);
          setUploadedFiles(fileResponse);
        } catch (error) {
          console.error("ducked");
        }
      }
    });
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({ onDrop });
  return (
    <div {...getRootProps()} className={styles.fileUploader}>
      <input data-testid="dropzone" {...getInputProps()} />
      <>
        <p>Dra filene hit eller</p>
        <Button onClick={open}>Velg filer</Button>
      </>
    </div>
  );
}
