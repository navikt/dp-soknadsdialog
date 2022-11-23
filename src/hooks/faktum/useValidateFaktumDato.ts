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

type dateFaktumErrorType = "invalidDate" | "invalidBirthDate";

interface IProps {
  setHasWarning: (value: boolean) => void;
  getErrorMessage: () => string | undefined;
  getWarningMessage: () => string | undefined;
  isValidDate: (value: Date) => boolean;
}

export function useValidateFaktumDato(faktum: QuizFaktum): IProps {
  const { getAppText, getFaktumTextById } = useSanity();
  const { unansweredFaktumId } = useValidation();
  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);
  const [hasError, setHasError] = useState<boolean | dateFaktumErrorType>(false);
  const [hasWarning, setHasWarning] = useState(false);

  function isValidDate(date: Date) {
    switch (faktum.beskrivendeId) {
      case "faktum.dagpenger-soknadsdato": {
        const isValid = isFromYear1900(date);
        const hasWarning = isOverTwoWeeks(date);
        setHasError(!isValid ? "invalidDate" : false);
        setHasWarning(hasWarning);
        return isValid;
      }
      case "faktum.barn-foedselsdato": {
        const isValid = isFromYear1900(date) && !isFuture(date);
        setHasError(!isValid ? "invalidBirthDate" : false);
        return isValid;
      }
      default: {
        const isValid = isWithinValidYearRange(date);
        setHasError(!isValid ? "invalidDate" : false);
        return isValid;
      }
    }
  }

  function getErrorMessage() {
    if (hasError === "invalidDate") {
      return faktumTexts?.errorMessage ? faktumTexts.errorMessage : faktum.beskrivendeId;
    } else if (hasError === "invalidBirthDate") {
      // return "ugyldig fødselsdato";
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
    setHasWarning,
    getErrorMessage,
    getWarningMessage,
    isValidDate,
  };
}
