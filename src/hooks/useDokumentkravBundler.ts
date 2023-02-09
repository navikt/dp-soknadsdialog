import { useState } from "react";
import { IDokumentkrav } from "../types/documentation.types";
import { usePutRequest } from "./usePutRequest";
import { IDocumentationBundleBody } from "../pages/api/documentation/bundle";
import { useUuid } from "./useUuid";

export function useDokumentkravBundler() {
  const { uuid } = useUuid();
  const [isBundling, setIsBundling] = useState(false);
  const [noDocumentsToSave, setNoDocumentsToSave] = useState(false);
  const [dokumentkravWithNewFiles, setDokumentkravWithNewFiles] = useState<IDokumentkrav[]>([]);
  const [dokumentkravWithNewBundle, setDokumentkravWithNewBundle] = useState<IDokumentkrav[]>([]);
  const [dokumentkravWithBundleError, setDokumentkravWithBundleError] = useState<IDokumentkrav[]>(
    []
  );
  const [bundleAndSaveDokumentkravPut] =
    usePutRequest<IDocumentationBundleBody>("documentation/bundle");

  function isAllDokumentkravValid(): boolean {
    setNoDocumentsToSave(false);

    if (dokumentkravWithNewFiles.length === 0 && dokumentkravWithNewBundle.length === 0) {
      setNoDocumentsToSave(true);
      return false;
    }

    return true;
  }

  function setInitialDokumentkravWithNewFilesState(dokumentkravList: IDokumentkrav[]) {
    setDokumentkravWithNewFiles(dokumentkravList);
  }

  function addDokumentkravWithNewFiles(dokumentkrav: IDokumentkrav) {
    setDokumentkravWithNewFiles((currentState) =>
      addOrReplaceDokumentkravToState(dokumentkrav, currentState)
    );
    removeDokumentkravWithError(dokumentkrav);

    if (noDocumentsToSave) {
      setNoDocumentsToSave(false);
    }
  }

  function removeDokumentkravWithNewFiles(dokumentkrav: IDokumentkrav) {
    setDokumentkravWithNewFiles((currentState) =>
      removeDokumentkravFromState(dokumentkrav, currentState)
    );
  }

  function addDokumentkravWithError(dokumentkrav: IDokumentkrav) {
    setDokumentkravWithBundleError((currentState) =>
      addOrReplaceDokumentkravToState(dokumentkrav, currentState)
    );
  }

  function removeDokumentkravWithError(dokumentkrav: IDokumentkrav) {
    setDokumentkravWithBundleError((currentState) =>
      removeDokumentkravFromState(dokumentkrav, currentState)
    );
  }

  function removeDokumentkrav(dokumentkrav: IDokumentkrav) {
    removeDokumentkravWithError(dokumentkrav);
    removeDokumentkravWithNewFiles(dokumentkrav);
  }

  async function bundleAndSaveDokumentkrav(dokumentkrav: IDokumentkrav): Promise<boolean> {
    setIsBundling(true);
    const isRequestOk = await bundleAndSaveDokumentkravPut({
      uuid,
      dokumentkravId: dokumentkrav.id,
      fileUrns: dokumentkrav.filer.map((file) => ({ urn: file.urn })),
    });

    setIsBundling(false);
    if (isRequestOk) {
      removeDokumentkravWithError(dokumentkrav);
      removeDokumentkravWithNewFiles(dokumentkrav);
      setDokumentkravWithNewBundle((currentState) => [...currentState, dokumentkrav]);
      return true;
    } else {
      addDokumentkravWithError(dokumentkrav);
      return false;
    }
  }

  return {
    isBundling,
    noDocumentsToSave,
    dokumentkravWithNewBundle,
    dokumentkravWithNewFiles,
    dokumentkravWithBundleError,
    removeDokumentkrav,
    addDokumentkravWithNewFiles,
    isAllDokumentkravValid,
    bundleAndSaveDokumentkrav,
    setInitialDokumentkravWithNewFilesState,
  };
}

function addOrReplaceDokumentkravToState(
  dokumentkrav: IDokumentkrav,
  dokumentkravArray: IDokumentkrav[]
): IDokumentkrav[] {
  const dokumentkravIndex = dokumentkravArray.findIndex((krav) => krav.id === dokumentkrav.id);

  if (dokumentkravIndex === -1) {
    return [...dokumentkravArray, dokumentkrav];
  } else {
    const stateCopy = [...dokumentkravArray];
    stateCopy[dokumentkravIndex] = dokumentkrav;

    return stateCopy;
  }
}

function removeDokumentkravFromState(
  dokumentkrav: IDokumentkrav,
  dokumentkravArray: IDokumentkrav[]
): IDokumentkrav[] {
  const dokumentkravIndex = dokumentkravArray.findIndex((krav) => krav.id === dokumentkrav.id);

  if (dokumentkravIndex !== -1) {
    const stateCopy = [...dokumentkravArray];
    stateCopy.splice(dokumentkravIndex, 1);

    return stateCopy;
  }

  return dokumentkravArray;
}
