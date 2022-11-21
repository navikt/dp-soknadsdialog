import { isFuture } from "date-fns";
import { useState } from "react";
import {
  isFromYear1900,
  isOverTwoWeeks,
  isWithinYearRange,
} from "../../components/faktum/validation/validations.utils";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import { QuizFaktum } from "../../types/quiz.types";

interface IProps {
  hasError: boolean;
  hasWarning: boolean;
  setHasWarning: (value: boolean) => void;
  getErrorMessage: () => string | undefined;
  isValidDate: (value: Date) => boolean;
}

export function useValidateFaktumDato(faktum: QuizFaktum): IProps {
  const { getAppText, getFaktumTextById } = useSanity();
  const { unansweredFaktumId } = useValidation();
  const [hasWarning, setHasWarning] = useState(false);
  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);
  const [hasError, setHasError] = useState<boolean>(false);

  function isValidDate(date: Date) {
    switch (faktum.beskrivendeId) {
      case "faktum.dagpenger-soknadsdato": {
        const isValid = isFromYear1900(date);
        const hasWarning = isOverTwoWeeks(date);
        setHasError(!isValid);
        setHasWarning(hasWarning);
        return isValid;
      }
      case "faktum.barn-foedselsdato": {
        const isValid = isFromYear1900(date) && !isFuture(date);
        setHasError(!isValid);
        return isValid;
      }
      default: {
        const isValid = isWithinYearRange(date);
        setHasError(!isValid);
        return isValid;
      }
    }
  }

  function getErrorMessage() {
    if (unansweredFaktumId === faktum.id) {
      return getAppText("validering.faktum.ubesvart");
    } else if (hasError) {
      return faktumTexts?.errorMessage ? faktumTexts.errorMessage : faktum.beskrivendeId;
    } else {
      return undefined;
    }
  }

  return {
    hasError,
    hasWarning,
    setHasWarning,
    getErrorMessage,
    isValidDate,
  };
}
