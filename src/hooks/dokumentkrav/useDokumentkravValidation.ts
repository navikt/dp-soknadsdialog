import { useState } from "react";
import { DOKUMENTKRAV_SVAR_SEND_NAA } from "../../constants";
import { IDokumentkrav, IDokumentkravValidationError } from "../../types/documentation.types";

interface IUseDokumentkravValidation {
  isValid: (list: IDokumentkrav[]) => boolean;
  getValidationError: (value: IDokumentkrav) => IDokumentkravValidationError | undefined;
  validationErrors: IDokumentkravValidationError[];
}

export function useDokumentkravValidation(): IUseDokumentkravValidation {
  const [validationErrors, setValidationErrors] = useState<IDokumentkravValidationError[]>([]);

  function isValid(dokumentkravList: IDokumentkrav[]) {
    setValidationErrors([]);

    const unAnswered = dokumentkravList
      .filter((dokumentkrav) => {
        return !dokumentkrav.svar;
      })
      .map((dokumentkrav) => ({ errorType: "svar", dokumentkrav }));

    const lackingBegrunnelse = dokumentkravList
      .filter((dokumentkrav) => {
        const requiresBegrunnelse =
          dokumentkrav.svar && dokumentkrav.svar !== DOKUMENTKRAV_SVAR_SEND_NAA;
        return requiresBegrunnelse && !dokumentkrav.begrunnelse;
      })
      ?.map((dokumentkrav) => ({ errorType: "begrunnelse", dokumentkrav }));

    const lackingFiles = dokumentkravList
      .filter((dokumentkrav) => {
        return dokumentkrav.svar === DOKUMENTKRAV_SVAR_SEND_NAA && dokumentkrav.filer.length === 0;
      })
      .map((dokumentkrav) => ({ errorType: "filer", dokumentkrav }));

    if (unAnswered.length > 0 || lackingBegrunnelse.length > 0 || lackingFiles.length > 0) {
      setValidationErrors([...unAnswered, ...lackingBegrunnelse, ...lackingFiles]);

      return false;
    }

    return true;
  }

  function getValidationError(dokumentkrav: IDokumentkrav) {
    return validationErrors.find((item) => item.dokumentkrav.id === dokumentkrav.id);
  }

  return {
    isValid,
    getValidationError,
    validationErrors,
  };
}
