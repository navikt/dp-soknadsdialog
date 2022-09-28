import { useRouter } from "next/router";
import { useState } from "react";
import { bundleDokumentkrav } from "../../api/dokumentasjon-api";
import { DOKUMENTKRAV_SVAR_SEND_NAA } from "../../constants";
import { IDokumentkrav } from "../../types/documentation.types";

interface IUseDokumentkravBundler {
  bundle: (list: IDokumentkrav[]) => void;
  isBundling: boolean;
  bundleErrors: IDokumentkrav[];
}

export function useDokumentkravBundler(): IUseDokumentkravBundler {
  const router = useRouter();
  const { uuid } = router.query;

  const [isBundling, setIsBundling] = useState(false);
  const [bundleErrors, setBundleErrors] = useState<IDokumentkrav[]>([]);

  async function bundle(dokumentkravList: IDokumentkrav[]) {
    setBundleErrors([]);

    const tempErrorList: IDokumentkrav[] = [];

    const dokumentkravToBundle = dokumentkravList.filter((dokumentkrav) => {
      return dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NAA && dokumentkrav.filer.length > 0;
    });

    if (dokumentkravToBundle.length === 0) {
      return;
    }

    setIsBundling(true);

    await Promise.all(
      dokumentkravToBundle.map(async (dokumentkrav) => {
        if (dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NAA && dokumentkrav.filer.length > 0) {
          try {
            const response = await bundleDokumentkrav(uuid as string, dokumentkrav);
            if (!response.ok) {
              throw Error(response.statusText);
            }
          } catch {
            tempErrorList.push(dokumentkrav);
          }
        }
      })
    );

    setIsBundling(false);

    if (tempErrorList.length > 0) {
      setBundleErrors(tempErrorList);
      throw new Error();
    } else {
      return;
    }
  }

  return {
    bundle,
    isBundling,
    bundleErrors,
  };
}
