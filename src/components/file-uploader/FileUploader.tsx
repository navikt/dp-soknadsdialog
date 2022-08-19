import { Button } from "@navikt/ds-react";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import api from "../../api.utils";
import { IFileState, ErrorType, FileHandleState } from "../../types/documentation.types";
import styles from "./FileUploader.module.css";

interface IProps {
  id: string;
  onHandle: (value: IFileState[]) => void;
}

const ALLOWED_FILE_FORMATS = ["image/png", "image/jpg", "image/jpeg", "application/pdf"];
const MAX_FILE_SIZE = 52428800; // 400mb

export function FileUploader({ id, onHandle }: IProps) {
  const router = useRouter();
  const [handledFiles, setHandledFiles] = useState<IFileState[]>([]);

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

  function addHandledFiles(fileArray: IFileState[]) {
    setHandledFiles([...handledFiles, ...fileArray]);
  }

  function changeHandledFile(fileObj: IFileState, index: number) {
    const copy = [...handledFiles];
    copy[index] = fileObj;
    setHandledFiles(copy);
  }

  async function uploadFile(fileObj: IFileState, index: number) {
    if (!fileObj.file) {
      return;
    }

    const requestData = new FormData();
    requestData.append("file", fileObj.file);
    const url = api(`/documentation/${router.query.uuid}/${id}/upload`);

    // Do NOT specify content-type here, it gets browser generated with the correct boundary by default
    const postRequest = fetch(url, {
      method: "Post",
      headers: {
        accept: "application/json",
      },
      body: requestData,
    }).then((res) => res.json());

    try {
      const response = await postRequest;
      if (!response.ok) {
        throw Error(response.statusText);
      }
      fileObj.state = FileHandleState.Uploaded;
      fileObj.urn = response.urn;

      changeHandledFile(fileObj, index);
    } catch {
      fileObj.state = FileHandleState.Error;
      fileObj.error = ErrorType.ServerError;

      changeHandledFile(fileObj, index);
    }
  }

  const onDrop = useCallback(
    (selectedFiles: File[]) => {
      const tempFileList: IFileState[] = [];

      selectedFiles.forEach((file) => {
        const id = `${new Date().getTime()}-${file.name}`;
        const fileObj: IFileState = { id: id, file: file, name: file.name };

        if (!ALLOWED_FILE_FORMATS.includes(file.type)) {
          fileObj.state = FileHandleState.Error;
          fileObj.error = ErrorType.FileFormat;
        } else if (file.size > MAX_FILE_SIZE) {
          fileObj.state = FileHandleState.Error;
          fileObj.error = ErrorType.FileSize;
        } else {
          fileObj.state = FileHandleState.AwaitingUpload;
        }
        tempFileList.push(fileObj);
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
        <input data-testid="dropzone" {...getInputProps()} />
        <>
          <p>Dra filene hit eller</p>
          <Button onClick={open}>Velg filer</Button>
        </>
      </div>
    </>
  );
}
