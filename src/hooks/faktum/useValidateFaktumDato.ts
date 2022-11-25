import { isFuture } from "date-fns";
import { useState } from "react";
import {
  isFromYear1900,
  isOverTwoWeeks,
  isWithinValidYearRange,
} from "../../components/faktum/validation/validations.utils";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import { QuizFaktum } from "../../types/quiz.types";

type dateFaktumErrorType = "InvalidDate" | "InvalidBirthDate";

interface IUseValidateFaktumDato {
  getErrorMessage: () => string | undefined;
  getWarningMessage: () => string | undefined;
  isValid: (value: Date) => boolean;
}

export function useValidateFaktumDato(faktum: QuizFaktum): IUseValidateFaktumDato {
  const { getAppText, getFaktumTextById } = useSanity();
  const { unansweredFaktumId } = useValidation();
  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);
  const [hasError, setHasError] = useState<dateFaktumErrorType | undefined>(undefined);
  const [hasWarning, setHasWarning] = useState(false);

  function isValid(date: Date) {
    switch (faktum.beskrivendeId) {
      case "faktum.dagpenger-soknadsdato": {
        const isValid = isFromYear1900(date);
        const hasWarning = isOverTwoWeeks(date);
        setHasError(!isValid ? "InvalidDate" : undefined);
        setHasWarning(hasWarning);
        return isValid;
      }
      case "faktum.barn-foedselsdato": {
        const future = isFuture(date);
        const fromYear1900 = isFromYear1900(date);

        if (!fromYear1900) {
          setHasError("InvalidDate");
        } else if (future) {
          setHasError("InvalidBirthDate");
        } else {
          setHasError(undefined);
        }

        return !isFuture && isFromYear1900;
      }
      default: {
        const isValid = isWithinValidYearRange(date);
        setHasError(!isValid ? "InvalidDate" : undefined);
        return isValid;
      }
    }
  }

  function getErrorMessage() {
    if (hasError && faktum.beskrivendeId === "faktum.barn-foedselsdato") {
      return hasError === "InvalidBirthDate"
        ? faktumTexts?.errorMessage
        : getAppText("validering.ugyldig-dato");
    } else if (hasError) {
      return faktumTexts?.errorMessage ? faktumTexts.errorMessage : faktum.beskrivendeId;
    } else if (unansweredFaktumId === faktum.id) {
      return getAppText("validering.faktum.ubesvart");
    } else {
      return undefined;
    }
  }

  function getWarningMessage() {
    return hasWarning ? getAppText("validering.dato-faktum.soknadsdato-varsel") : undefined;
  }

  return {
    getErrorMessage,
    getWarningMessage,
    isValid,
  };
}
