import { useState } from "react";
import { IDokumentkrav } from "../../types/documentation.types";
import { usePutRequest } from "../usePutRequest";
import { IDocumentationBundleBody } from "../../pages/api/documentation/bundle";
import { useUuid } from "../useUuid";

export function useEttersending() {
  const { uuid } = useUuid();
  const [dokumentkravWithError, setDokumentkravWithError] = useState<IDokumentkrav[]>([]);
  const [dokumentkravToBundleAndSave, setDokumentkravToBundleAndSave] = useState<IDokumentkrav[]>(
    []
  );
  const [bundleAndSaveDokumentkravPut] =
    usePutRequest<IDocumentationBundleBody>("documentation/bundle");

  function addDokumentkravToBundleAndSave(dokumentkrav: IDokumentkrav) {
    const dokumentkravIndex = dokumentkravToBundleAndSave.findIndex(
      (krav) => krav.id === dokumentkrav.id
    );

    if (dokumentkravIndex === -1) {
      setDokumentkravToBundleAndSave((currentState) => [...currentState, dokumentkrav]);
    } else {
      const stateCopy = [...dokumentkravToBundleAndSave];
      stateCopy[dokumentkravIndex] = dokumentkrav;

      setDokumentkravToBundleAndSave(stateCopy);
    }
  }

  function removeDokumentkravToBundleAndSave(dokumentkrav: IDokumentkrav) {
    const dokumentkravIndex = dokumentkravToBundleAndSave.findIndex(
      (krav) => krav.id === dokumentkrav.id
    );

    if (dokumentkravIndex !== -1) {
      const stateCopy = [...dokumentkravToBundleAndSave];
      stateCopy.splice(dokumentkravIndex, 1);

      setDokumentkravToBundleAndSave(stateCopy);
    }
  }

  function addDokumentkravWithError(dokumentkrav: IDokumentkrav) {
    const dokumentkravIndex = dokumentkravWithError.findIndex(
      (krav) => krav.id === dokumentkrav.id
    );

    if (dokumentkravIndex === -1) {
      setDokumentkravWithError((currentState) => [...currentState, dokumentkrav]);
    } else {
      const stateCopy = [...dokumentkravWithError];
      stateCopy[dokumentkravIndex] = dokumentkrav;

      setDokumentkravWithError(stateCopy);
    }
  }

  function removeDokumentkravWithError(dokumentkrav: IDokumentkrav) {
    const dokumentkravIndex = dokumentkravWithError.findIndex(
      (krav) => krav.id === dokumentkrav.id
    );

    if (dokumentkravIndex !== -1) {
      const stateCopy = [...dokumentkravWithError];
      stateCopy.splice(dokumentkravIndex, 1);

      setDokumentkravWithError(stateCopy);
    }
  }

  async function bundleAndSaveDokumentkrav(dokumentkrav: IDokumentkrav) {
    const isRequestOk = await bundleAndSaveDokumentkravPut({
      uuid,
      dokumentkravId: dokumentkrav.id,
      fileUrns: dokumentkrav.filer.map((file) => ({ urn: file.urn })),
    });

    if (isRequestOk) {
      removeDokumentkravWithError(dokumentkrav);
      removeDokumentkravToBundleAndSave(dokumentkrav);
    } else {
      addDokumentkravWithError(dokumentkrav);
    }
  }

  return {
    dokumentkravWithError,
    dokumentkravToBundleAndSave,
    addDokumentkravToBundleAndSave,
    bundleAndSaveDokumentkrav,
  };
}
