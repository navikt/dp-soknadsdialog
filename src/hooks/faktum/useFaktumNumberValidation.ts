import { useState } from "react";
import {
  isValidArbeidstimer,
  isValidPermitteringsPercent,
} from "../../components/faktum/validation/validations.utils";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";

type NumberValidationErrorTypes = "negativeValue" | "invalidValue" | "notNumber" | "emptyValue";

interface IProps {
  setHasError: (hasError: boolean | NumberValidationErrorTypes) => void;
  getErrorMessage: (faktumId: string) => string | undefined;
  isValidInput: (value: number | null) => boolean;
}

export function useValidateFaktumNumber(faktumBeskrivendeId: string): IProps {
  const { getAppText, getFaktumTextById } = useSanity();
  const { unansweredFaktumId } = useValidation();
  const faktumTexts = getFaktumTextById(faktumBeskrivendeId);
  const [hasError, setHasError] = useState<boolean | NumberValidationErrorTypes>(false);

  function isValidInput(value: number | null) {
    if (faktumBeskrivendeId === "faktum.arbeidsforhold.permittert-prosent") {
      if (value === null) {
        setHasError("emptyValue");
        return false;
      }

      const isValid = isValidPermitteringsPercent(value);
      setHasError(!isValid ? "invalidValue" : false);
      return isValid;
    }

    if (faktumBeskrivendeId === "faktum.arbeidsforhold.antall-timer-dette-arbeidsforhold") {
      if (value === null) {
        setHasError("emptyValue");
        return false;
      }

      const isValid = isValidArbeidstimer(value);
      setHasError(!isValid ? "invalidValue" : false);
      return isValid;
    }

    if (value === null || value === 0) {
      setHasError(false);
      return true;
    }

    if (value < 0) {
      setHasError("negativeValue");
      return false;
    }

    setHasError(false);
    return true;
  }

  function getErrorMessageByErrorType() {
    switch (hasError) {
      case "emptyValue":
        return getAppText("validering.number-faktum.tom-svar");
      case "negativeValue":
        return getAppText("validering.number-faktum.ikke-negativt-tall");
      case "notNumber":
        return getAppText("validering.number-faktum.maa-vaere-et-tall");
      case "invalidValue":
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
    isValidInput,
  };
}
