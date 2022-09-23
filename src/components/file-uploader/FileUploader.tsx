import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Alert, Button, Loader } from "@navikt/ds-react";
import { IDokumentkrav, IDokumentkravFil } from "../../types/documentation.types";
import { useRouter } from "next/router";
import { saveDokumenkravFile } from "../../api/dokumentasjon-api";
import styles from "./FileUploader.module.css";
import { ALLOWED_FILE_FORMATS } from "../../constants";
import { useSanity } from "../../context/sanity-context";

interface IProps {
  dokumentkrav: IDokumentkrav;
  handleUploadedFiles: (file: IDokumentkravFil) => void;
  maxFileSize: number;
}
interface IFileError {
  fileName: string;
  error: "INVALID_FILE_FORMAT" | "INVALID_FILE_SIZE" | "SERVER_ERROR";
}

export function FileUploader({ dokumentkrav, handleUploadedFiles, maxFileSize }: IProps) {
  const router = useRouter();
  const { getAppTekst } = useSanity();
  const uuid = router.query.uuid as string;
  const [errors, setErrors] = useState<IFileError[]>([]);
  const hasServerError = errors.find((item) => item.error === "SERVER_ERROR");
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((selectedFiles: File[]) => {
    setErrors([]);
    setIsLoading(true);

    selectedFiles.forEach(async (file, index) => {
      if (!ALLOWED_FILE_FORMATS.includes(file.type)) {
        setErrors((currentState) => [
          ...currentState,
          { fileName: file.name, error: "INVALID_FILE_FORMAT" },
        ]);
      } else if (file.size > maxFileSize) {
        setErrors((currentState) => [
          ...currentState,
          { fileName: file.name, error: "INVALID_FILE_SIZE" },
        ]);
      } else {
        try {
          const fileResponse = await saveDokumenkravFile(file, uuid, dokumentkrav.id);

          if (fileResponse.ok) {
            const savedDokumentkravFile = await fileResponse.json();
            handleUploadedFiles(savedDokumentkravFile);
          } else {
            throw Error(fileResponse.statusText);
          }
        } catch (error) {
          setErrors((currentState) => [
            ...currentState,
            { fileName: file.name, error: "SERVER_ERROR" },
          ]);
        }
      }

      if (index === selectedFiles.length - 1) {
        setIsLoading(false);
      }
    });
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({ onDrop });
  return (
    <>
      <div {...getRootProps()} className={styles.fileUploader}>
        <input data-testid="dropzone" {...getInputProps()} />
        <>
          <>
            <p>{getAppTekst("filopplaster.dra.filene.hit")}</p>
            <Button onClick={open}>{getAppTekst("filopplaster.velg.filer")}</Button>
          </>
        </>
      </div>

      {isLoading && (
        <div className={styles.loadingIndicator}>
          <Loader size="large" />
        </div>
      )}

      {errors.length > 0 && (
        <div className={styles.uploadError}>
          <Alert variant={"error"}>
            {getAppTekst("filopplaster.feil.beskrivelse")}
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error.fileName}</li>
              ))}
            </ul>
            {!hasServerError && (
              <span>{getAppTekst("filopplaster.feil.beskrivelse-format-storrelse")}</span>
            )}
          </Alert>
        </div>
      )}
    </>
  );
}
