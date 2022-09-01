import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Alert, Button } from "@navikt/ds-react";
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
interface IFileError {
  fileName: string;
  error: "INVALID_FILE_FORMAT" | "INVALID_FILE_SIZE" | "SERVER_ERROR";
}

export function FileUploader({ dokumentkravId, setUploadedFiles }: IProps) {
  const router = useRouter();
  const uuid = router.query.uuid as string;
  const [errors, setErrors] = useState<IFileError[]>([]);

  const onDrop = useCallback((selectedFiles: File[]) => {
    setErrors([]);
    selectedFiles.forEach(async (file) => {
      if (!ALLOWED_FILE_FORMATS.includes(file.type)) {
        setErrors((currentState) => [
          ...currentState,
          { fileName: file.name, error: "INVALID_FILE_FORMAT" },
        ]);
      } else if (file.size > MAX_FILE_SIZE) {
        setErrors((currentState) => [
          ...currentState,
          { fileName: file.name, error: "INVALID_FILE_SIZE" },
        ]);
      } else {
        try {
          const fileResponse = await saveDokumenkravFile(file, uuid, dokumentkravId);
          // Only save the first response, since we only save one file at a time
          setUploadedFiles(fileResponse[0]);
        } catch (error) {
          setErrors((currentState) => [
            ...currentState,
            { fileName: file.name, error: "SERVER_ERROR" },
          ]);
        }
      }
    });
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({ onDrop });
  return (
    <>
      {errors.length > 0 && (
        <Alert variant={"error"}>
          {errors.map((error, index) => (
            <p key={index}>
              <span>{error.error}: </span>
              <span>{error.fileName}</span>
            </p>
          ))}
        </Alert>
      )}
      <div {...getRootProps()} className={styles.fileUploader}>
        <input data-testid="dropzone" {...getInputProps()} />
        <>
          <p>Dra filene hit eller</p>
          <Button onClick={open}>Velg filer</Button>
        </>
      </div>
    </>
  );
}
