import { useState } from "react";
import { IDokumentkrav } from "../types/documentation.types";
import { usePutRequest } from "./usePutRequest";
import { IDocumentationBundleBody } from "../pages/api/documentation/bundle";
import { useUuid } from "./useUuid";

export function useDokumentkravBundler() {
  const { uuid } = useUuid();
  const [isBundling, setIsBundling] = useState(false);
  const [noDocumentsToSave, setNoDocumentsToSave] = useState(false);
  const [dokumentkravWithBundleError, setDokumentkravWithBundleError] = useState<IDokumentkrav[]>(
    []
  );
  const [bundleAndSaveDokumentkravPut] =
    usePutRequest<IDocumentationBundleBody>("documentation/bundle");

  async function bundleDokumentkravList(dokumentkravList: IDokumentkrav[]) {
    if (dokumentkravList.length === 0) {
      setNoDocumentsToSave(true);
      return;
    }

    setNoDocumentsToSave(false);
    setDokumentkravWithBundleError([]);

    const tmpErrorList: IDokumentkrav[] = [];
    let readyToEttersend = true;

    await Promise.all(
      dokumentkravList.map(async (dokumentkrav) => {
        const res = await bundleAndSaveDokumentkrav(dokumentkrav);
        if (!res) {
          tmpErrorList.push(dokumentkrav);
          readyToEttersend = false;
        }
      })
    );

    if (tmpErrorList.length > 0) {
      setDokumentkravWithBundleError(tmpErrorList);
    }

    return readyToEttersend;
  }

  async function bundleAndSaveDokumentkrav(dokumentkrav: IDokumentkrav): Promise<boolean> {
    setIsBundling(true);
    const isRequestOk = await bundleAndSaveDokumentkravPut({
      uuid,
      dokumentkravId: dokumentkrav.id,
      fileUrns: dokumentkrav.filer.map((file) => ({ urn: file.urn })),
    });

    setIsBundling(false);
    return isRequestOk;
  }

  return {
    isBundling,
    noDocumentsToSave,
    dokumentkravWithBundleError,
    bundleDokumentkravList,
  };
}
