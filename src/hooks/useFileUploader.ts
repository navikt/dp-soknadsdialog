import { useState } from "react";
import { IDokumentkravFil } from "../types/documentation.types";

export function useFileUploader(files?: IDokumentkravFil[]) {
  const [uploadedFiles, setUploadedFiles] = useState<IDokumentkravFil[]>(files || []);

  function handleUploadedFiles(file: IDokumentkravFil) {
    setUploadedFiles((currentState) => {
      const indexOfFile = currentState.findIndex((f) => f.filsti === file.filsti);

      if (indexOfFile !== -1) {
        // Splice returns deleted object, need to return mutated array
        const copy = [...currentState];
        copy.splice(indexOfFile, 1);
        return copy;
      } else {
        return [...currentState, file];
      }
    });
  }

  return { uploadedFiles, handleUploadedFiles };
}
