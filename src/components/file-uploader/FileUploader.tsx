import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Alert, Button } from "@navikt/ds-react";
import { IDokumentkrav, IDokumentkravFil } from "../../types/documentation.types";
import { useRouter } from "next/router";
import { saveDokumenkravFile } from "../../api/dokumentasjon-api";
import { ALLOWED_FILE_FORMATS } from "../../constants";
import { useSanity } from "../../context/sanity-context";
import styles from "./FileUploader.module.css";

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
  const { getAppText } = useSanity();
  const [errors, setErrors] = useState<IFileError[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const uuid = router.query.uuid as string;
  const hasServerError = errors.find((item) => item.error === "SERVER_ERROR");

  const onDrop = useCallback(async (selectedFiles: File[]) => {
    setErrors([]);
    setIsLoading(true);

    await Promise.all(
      selectedFiles.map(async (file) => {
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
      })
    );

    setIsLoading(false);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });
  return (
    <>
      <div {...getRootProps()} className={styles.fileUploader}>
        <input data-testid="dropzone" {...getInputProps()} />

        <span className={styles.hasHover}>
          <p>
            <b>{getAppText("filopplaster.tekst.dra-filene-hit")}</b>
            <br />
            {getAppText("filopplaster.tekst.eller")}
          </p>
        </span>
        <Button loading={isLoading}>{getAppText("filopplaster.knapp.velg-filer")}</Button>
      </div>

      {errors.length > 0 && (
        <div className={styles.uploadError}>
          <Alert variant={"error"}>
            {getAppText("filopplaster.feilmelding.beskrivelse")}
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error.fileName}</li>
              ))}
            </ul>
            {!hasServerError && (
              <span>{getAppText("filopplaster.feilmelding.format-storrelse-beskrivelse")}</span>
            )}
          </Alert>
        </div>
      )}
    </>
  );
}
