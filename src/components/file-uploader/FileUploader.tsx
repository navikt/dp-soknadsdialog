import { Button } from "@navikt/ds-react";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import api from "../../api.utils";
import { FileState, ErrorType, FileHandleState } from "../../types/documentation.types";
import styles from "./FileUploader.module.css";

interface Props {
  id: string;
  onHandle: (value: FileState[]) => void;
}

export function FileUploader({ id, onHandle }: Props) {
  const router = useRouter();
  const FILE_FORMATS = ["image/png", "image/jpg", "image/jpeg", "application/pdf"];
  const MAX_FILE_SIZE = 52428800; // 400mb
  const [handledFiles, setHandledFiles] = useState<FileState[]>([]);

  useEffect(() => {
    onHandle(handledFiles);

    // Only do one upload per useEffect call
    const uploadIndex = handledFiles.findIndex((fileObj) => {
      return fileObj.state === FileHandleState.AwaitingUpload;
    });

    if (uploadIndex > -1) {
      uploadFile(handledFiles[uploadIndex], uploadIndex);
    }
  }, [handledFiles]);

  function addHandledFiles(fileArray: FileState[]) {
    setHandledFiles([...handledFiles, ...fileArray]);
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
        fileObj.state = FileHandleState.Uploaded;
        fileObj.urn = res.urn;

        changeHandledFile(fileObj, index);
      })
      .catch(() => {
        fileObj.state = FileHandleState.Error;
        fileObj.error = ErrorType.ServerError;

        changeHandledFile(fileObj, index);
      });
  }

  const onDrop = useCallback(
    (selectedFiles: File[]) => {
      const tempFileList: FileState[] = [];

      selectedFiles.forEach((file) => {
        const id = `${new Date().getTime()}-${file.name}`;
        const fileObj: FileState = { id: id, file: file, name: file.name };

        if (!FILE_FORMATS.includes(file.type)) {
          fileObj.state = FileHandleState.Error;
          fileObj.error = ErrorType.FileFormat;

          tempFileList.push(fileObj);
        } else if (file.size > MAX_FILE_SIZE) {
          fileObj.state = FileHandleState.Error;
          fileObj.error = ErrorType.FileSize;
          tempFileList.push(fileObj);
        } else {
          fileObj.state = FileHandleState.AwaitingUpload;
          tempFileList.push(fileObj);
        }
      });

      addHandledFiles(tempFileList);
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
