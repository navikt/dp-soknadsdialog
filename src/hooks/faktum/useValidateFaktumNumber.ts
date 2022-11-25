import { useState } from "react";
import {
  isValidArbeidstimer,
  isValidPermitteringsPercent,
} from "../../components/faktum/validation/validations.utils";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";

type numberValidationErrorTypes = "NegativeValue" | "InvalidValue" | "NotNumber" | "EmptyValue";

interface IUseValidateFaktumNumber {
  setHasError: (hasError: numberValidationErrorTypes | undefined) => void;
  getErrorMessage: (faktumId: string) => string | undefined;
  isValid: (value: number | null) => boolean;
}

export function useValidateFaktumNumber(faktumBeskrivendeId: string): IUseValidateFaktumNumber {
  const { getAppText, getFaktumTextById } = useSanity();
  const { unansweredFaktumId } = useValidation();
  const faktumTexts = getFaktumTextById(faktumBeskrivendeId);
  const [hasError, setHasError] = useState<numberValidationErrorTypes | undefined>(undefined);

  function isValid(value: number | null) {
    if (faktumBeskrivendeId === "faktum.arbeidsforhold.permittert-prosent") {
      if (value === null) {
        setHasError("EmptyValue");
        return false;
      }

      const isValid = isValidPermitteringsPercent(value);
      setHasError(!isValid ? "InvalidValue" : undefined);
      return isValid;
    }

    if (faktumBeskrivendeId === "faktum.arbeidsforhold.antall-timer-jobbet") {
      if (value === null) {
        setHasError("EmptyValue");
        return false;
      }

      const isValid = isValidArbeidstimer(value);
      setHasError(!isValid ? "InvalidValue" : undefined);
      return isValid;
    }

    if (value === null || value === 0) {
      setHasError(undefined);
      return true;
    }

    if (value < 0) {
      setHasError("NegativeValue");
      return false;
    }

    setHasError(undefined);
    return true;
  }

  function getErrorMessageByErrorType() {
    switch (hasError) {
      case "EmptyValue":
        return getAppText("validering.number-faktum.tom-svar");
      case "NegativeValue":
        return getAppText("validering.number-faktum.ikke-negativt-tall");
      case "NotNumber":
        return getAppText("validering.number-faktum.maa-vaere-et-tall");
      case "InvalidValue":
        return faktumTexts?.errorMessage ?? getAppText("validering.number-faktum.ugyldig");
      default:
        return undefined;
    }
  }

  function getErrorMessage(faktumId: string) {
    if (unansweredFaktumId === faktumId) {
      return getAppText("validering.faktum.ubesvart");
    } else if (hasError) {
      return getErrorMessageByErrorType();
    } else {
      undefined;
    }
  }

  return {
    setHasError,
    getErrorMessage,
    isValid,
  };
}
