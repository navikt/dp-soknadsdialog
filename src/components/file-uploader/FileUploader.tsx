import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Alert, Button } from "@navikt/ds-react";
import { IDokumentkrav, IDokumentkravFil } from "../../types/documentation.types";
import { useRouter } from "next/router";
import { ALLOWED_FILE_FORMATS } from "../../constants";
import { useSanity } from "../../context/sanity-context";
import styles from "./FileUploader.module.css";
import { saveDokumenkravFile } from "../../pages/api/common/dokumentasjon-api";

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
            /* eslint-disable @typescript-eslint/no-unused-vars */
          } catch (error: unknown) {
            setErrors((currentState) => [
              ...currentState,
              { fileName: file.name, error: "SERVER_ERROR" },
            ]);
          }
        }
      }),
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

        <div className={styles.hasHover}>
          <p>
            <strong>{getAppText("filopplaster.tekst.dra-filene-hit")}</strong>
            <br />
            {getAppText("filopplaster.tekst.eller")}
          </p>
        </div>
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
