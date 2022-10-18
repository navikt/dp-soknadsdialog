import { useState } from "react";
import { IDokumentkravFil } from "../types/documentation.types";

export function useFileUploader(files?: IDokumentkravFil[]) {
  const [uploadedFiles, setUploadedFiles] = useState<IDokumentkravFil[]>(files || []);

  function handleUploadedFiles(file: IDokumentkravFil) {
    const fileState = [...uploadedFiles];
    const indexOfFile = fileState.findIndex((f) => f.filsti === file.filsti);

    if (indexOfFile !== -1) {
      fileState.splice(indexOfFile, 1);
      setUploadedFiles(fileState);
    } else {
      setUploadedFiles((currentState) => [...currentState, file]);
    }
  }

  function resetUploadFiles() {
    setUploadedFiles([]);
  }

  return { uploadedFiles, handleUploadedFiles, resetUploadFiles };
}
