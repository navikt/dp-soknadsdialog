import { useState } from "react";
import { DOKUMENTKRAV_SVAR_SEND_NAA } from "../../constants";
import { IDokumentkrav } from "../../types/documentation.types";
import { usePutRequest } from "../usePutRequest";
import { IDocumentationBundleBody } from "../../pages/api/documentation/bundle";
import { useUuid } from "../useUuid";

interface IUseDokumentkravBundler {
  bundleFiles: (list: IDokumentkrav[]) => void;
  isBundling: boolean;
  bundleErrors: IDokumentkrav[];
  hasBundleError: (dokumentkrav: IDokumentkrav) => boolean;
}

export function useDokumentkravBundler(): IUseDokumentkravBundler {
  const { uuid } = useUuid();
  const [isBundling, setIsBundling] = useState(false);
  const [bundleErrors, setBundleErrors] = useState<IDokumentkrav[]>([]);
  const [bundleAndSaveDokumentkravPut] =
    usePutRequest<IDocumentationBundleBody>("documentation/bundle");

  async function bundleFiles(dokumentkravList: IDokumentkrav[]) {
    setBundleErrors([]);

    const tempErrorList: IDokumentkrav[] = [];

    const dokumentkravToBundle = dokumentkravList.filter((dokumentkrav) => {
      return dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NAA && dokumentkrav.filer.length > 0;
    });

    if (dokumentkravToBundle.length === 0) {
      return;
    }

    setIsBundling(true);

    for (const dokumentkrav of dokumentkravToBundle) {
      if (dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NAA && dokumentkrav.filer.length > 0) {
        const responseOk = await bundleAndSaveDokumentkravPut({
          uuid,
          dokumentkravId: dokumentkrav.id,
          fileUrns: dokumentkrav.filer.map((file) => ({ urn: file.urn })),
        });

        if (!responseOk) {
          tempErrorList.push(dokumentkrav);
        }
      }
    }

    setIsBundling(false);

    if (tempErrorList.length > 0) {
      setBundleErrors(tempErrorList);
      throw new Error();
    } else {
      return;
    }
  }

  function hasBundleError(dokumentkrav: IDokumentkrav) {
    return (
      bundleErrors.findIndex((item) => {
        return item.id === dokumentkrav.id;
      }) > -1
    );
  }

  return {
    bundleFiles,
    isBundling,
    bundleErrors,
    hasBundleError,
  };
}
