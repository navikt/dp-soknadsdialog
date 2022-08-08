import { Alert, Button } from "@navikt/ds-react";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import api from "../../api.utils";
import { FileError, UploadedFile } from "../../types/documentation.types";
import styles from "./FileUploader.module.css";

interface Props {
  id: string;
  filer?: UploadedFile[];
  onUpload: (value: UploadedFile[]) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function FileUploader({ id, filer, onUpload }: Props) {
  const router = useRouter();
  const MAX_FILE_SIZE = 1000000; // 1 mb inntil videre
  const FILE_FORMATS = ["image/png", "image/jpg", "image/jpeg"]; // Kun bilder inntil videre

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(filer || []);
  const [errors, setErrors] = useState<FileError[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const errorList: FileError[] = [];
      const newFiles: File[] = [];

      acceptedFiles.forEach((file) => {
        if (file.size > MAX_FILE_SIZE) {
          errorList.push({ file: file.name, reason: "FILE_SIZE" });
        } else if (!FILE_FORMATS.includes(file.type)) {
          errorList.push({ file: file.name, reason: "FILE_FORMAT" });
        } else {
          newFiles.push(file);
        }
      });

      const requestData = new FormData();

      newFiles.forEach((file) => {
        requestData.append("file", file);
      });

      const url = api(`/documentation/${router.query.uuid}/${id}/upload`);

      // Do NOT specify content-type here, it gets browser generated with the correct boundary by default
      fetch(url, {
        method: "Post",
        headers: {
          accept: "application/json",
        },
        body: requestData,
      })
        .then((res) => res.json())
        .then((res) => {
          // eslint-disable-next-line no-console
          console.log(res);
          setUploadedFiles(uploadedFiles.concat(res));
          onUpload(uploadedFiles);
        })
        .catch((error) => {
          alert("Dette feilet: " + error);
        });

      setErrors(errorList);
    },
    [uploadedFiles]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop,
  });

  return (
    <>
      <div {...getRootProps()} className={styles.fileUploader}>
        <input {...getInputProps()} />
        <>
          <p>Dra filene hit eller</p>
          <Button onClick={open}>Velg filer</Button>
        </>
      </div>

      {errors.length > 0 &&
        errors.map((error, index) => {
          return (
            <Alert key={index} variant="error">
              Fil med filnavn {error.file} kunne ikke lastes opp grunnet {error.reason}
            </Alert>
          ); // TODO: Fiks en bedre index
        })}
    </>
  );
}
