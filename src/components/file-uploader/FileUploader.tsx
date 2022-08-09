import { Button } from "@navikt/ds-react";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import api from "../../api.utils";
import { FileState } from "../../types/documentation.types";
import styles from "./FileUploader.module.css";

interface Props {
  id: string;
  onHandle: (value: FileState[]) => void;
}

export function FileUploader({ id, onHandle }: Props) {
  const router = useRouter();
  const MAX_FILE_SIZE = 52428800; // 400mb
  const FILE_FORMATS = ["image/png", "image/jpg", "image/jpeg", "application/pdf"];
  const [handledFiles, setHandledFiles] = useState<FileState[]>([]);

  useEffect(() => {
    onHandle(handledFiles);

    handledFiles.forEach((fileObj, index) => {
      if (fileObj.state === "UPLOADING") {
        uploadFile(fileObj, index);
      }
    });
  }, [handledFiles]);

  function addHandledFile(fileObj: FileState) {
    setHandledFiles([...handledFiles, fileObj]);
  }

  function changeHandledFile(fileObj: FileState, index: number) {
    const copy = [...handledFiles];
    copy[index] = fileObj;
    setHandledFiles(copy);
  }

  function uploadFile(fileObj: FileState, index: number) {
    if (!fileObj.file) {
      return;
    }

    const requestData = new FormData();
    requestData.append("file", fileObj.file);
    const url = api(`/documentation/${router.query.uuid}/${id}/upload`);

    // Do NOT specify content-type here, it gets browser generated with the correct boundary by default
    fetch(url, {
      method: "Post",
      headers: {
        accept: "application/json",
      },
      body: requestData,
    })
      .then((res) => {
        if (!res.ok) {
          throw Error(res.statusText);
        }

        return res;
      })
      .then((res) => res.json())
      .then((res) => {
        fileObj.state = "UPLOADED";
        fileObj.urn = res.urn;

        changeHandledFile(fileObj, index);
      })
      .catch(() => {
        fileObj.state = "ERROR";
        fileObj.error = "SERVER_ERROR";

        changeHandledFile(fileObj, index);
      });
  }

  const onDrop = useCallback(
    (selectedFiles: File[]) => {
      selectedFiles.forEach((file) => {
        const id = `${new Date().getTime()}-${file.name}`;
        const fileObj: FileState = { id: id, file: file, name: file.name };

        if (file.size > MAX_FILE_SIZE) {
          fileObj.state = "ERROR";
          fileObj.error = "FILE_SIZE";

          addHandledFile(fileObj);
        } else if (!FILE_FORMATS.includes(file.type)) {
          fileObj.state = "ERROR";
          fileObj.error = "FILE_FORMAT";
          addHandledFile(fileObj);
        } else {
          fileObj.state = "UPLOADING";
          addHandledFile(fileObj);
        }
      });
    },
    [handledFiles]
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
    </>
  );
}
