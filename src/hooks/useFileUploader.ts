import { useState } from "react";
import { IDokumentkravFil } from "../types/documentation.types";

export function useFileUploader(files?: IDokumentkravFil[]) {
  const [uploadedFiles, setUploadedFiles] = useState<IDokumentkravFil[]>(files || []);

  function handleUploadedFiles(file: IDokumentkravFil) {
    const indexOfFile = uploadedFiles.findIndex((f) => f.filsti === file.filsti);

    if (indexOfFile !== -1) {
      setUploadedFiles((currentState) => currentState.splice(indexOfFile, 1));
    } else {
      setUploadedFiles((currentState) => [...currentState, file]);
    }
  }

  return { uploadedFiles, handleUploadedFiles };
}
