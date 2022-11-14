import { useState } from "react";
import { IDokumentkrav } from "../../types/documentation.types";
import { usePutRequest } from "../usePutRequest";
import { IDocumentationBundleBody } from "../../pages/api/documentation/bundle";
import { useUuid } from "../useUuid";

export function useEttersending() {
  const { uuid } = useUuid();
  const [isBundling, setIsBundling] = useState(false);
  const [dokumentkravWithError, setDokumentkravWithError] = useState<IDokumentkrav[]>([]);
  const [dokumentkravWithNewFiles, setDokumentkravWithNewFiles] = useState<IDokumentkrav[]>([]);
  const [dokumentkravWithNewBundle, setDokumentkravWithNewBundle] = useState<IDokumentkrav[]>([]);
  const [bundleAndSaveDokumentkravPut] =
    usePutRequest<IDocumentationBundleBody>("documentation/bundle");

  function addDokumentkravWithNewFiles(dokumentkrav: IDokumentkrav) {
    const newState = addOrReplaceDokumentkravToState(dokumentkrav, dokumentkravWithNewFiles);
    setDokumentkravWithNewFiles(newState);
  }

  function removeDokumentkravWithNewFiles(dokumentkrav: IDokumentkrav) {
    const newState = removeDokumentkravFromState(dokumentkrav, dokumentkravWithNewFiles);
    if (newState) {
      setDokumentkravWithNewFiles(newState);
    }
  }

  function addDokumentkravWithError(dokumentkrav: IDokumentkrav) {
    const newState = addOrReplaceDokumentkravToState(dokumentkrav, dokumentkravWithError);
    setDokumentkravWithError(newState);
  }

  function removeDokumentkravWithError(dokumentkrav: IDokumentkrav) {
    const newState = removeDokumentkravFromState(dokumentkrav, dokumentkravWithError);
    if (newState) {
      setDokumentkravWithError(newState);
    }
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
    dokumentkravWithNewBundle,
    dokumentkravWithError,
    dokumentkravWithNewFiles,
    removeDokumentkrav,
    addDokumentkravWithNewFiles,
    bundleAndSaveDokumentkrav,
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
): IDokumentkrav[] | undefined {
  const dokumentkravIndex = dokumentkravArray.findIndex((krav) => krav.id === dokumentkrav.id);

  if (dokumentkravIndex !== -1) {
    const stateCopy = [...dokumentkravArray];
    stateCopy.splice(dokumentkravIndex, 1);

    return stateCopy;
  }

  return undefined;
}
