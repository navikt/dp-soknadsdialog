import { isFuture } from "date-fns";
import { useState } from "react";
import {
  isOverTwoWeeks,
  isWithinValidYearRange,
} from "../../components/faktum/validation/validations.utils";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import { QuizFaktum } from "../../types/quiz.types";

type dateFaktumErrorType = "InvalidDate" | "InvalidBirthDate";

interface IUseValidateFaktumDato {
  getErrorMessage: () => string | undefined;
  isValid: (date: Date) => boolean | ((date: Date) => boolean);
  getHasWarning: (date: Date) => boolean;
}

export function useValidateFaktumDato(faktum: QuizFaktum): IUseValidateFaktumDato {
  const { getAppText, getFaktumTextById } = useSanity();
  const { unansweredFaktumId } = useValidation();
  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);
  const [hasError, setHasError] = useState<dateFaktumErrorType | undefined>(undefined);

  function isValid(date: Date) {
    switch (faktum.beskrivendeId) {
      case "faktum.barn-foedselsdato": {
        const future = isFuture(date);
        const isValid = isWithinValidYearRange(date);

        if (!isValid) {
          setHasError("InvalidDate");
        } else if (future) {
          setHasError("InvalidBirthDate");
        } else {
          setHasError(undefined);
        }

        return !future && isValid;
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

  function getHasWarning(date: Date) {
    return faktum.beskrivendeId === "faktum.dagpenger-soknadsdato" && isOverTwoWeeks(date);
  }

  return {
    getErrorMessage,
    isValid,
    getHasWarning,
  };
}
