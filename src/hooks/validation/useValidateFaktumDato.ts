import { isFuture } from "date-fns";
import { useEffect, useState } from "react";
import {
  isOverTwoWeeks,
  isWithinValidSoknadDatoRange,
  isWithinValidDateRange,
} from "../../components/faktum/validation/validations.utils";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import { QuizFaktum } from "../../types/quiz.types";
interface IUseValidateFaktumDato {
  validateAndIsValid: (date: Date | null) => boolean | ((date: Date | null) => boolean);
  applicationDateIsOverTwoWeeks: (date: Date) => boolean;
  errorMessage: string | undefined;
  clearErrorMessage: () => void;
}

const furetureDateAllowedList = [
  "faktum.dagpenger-soknadsdato",
  "faktum.arbeidsforhold.kontraktfestet-sluttdato",
  "faktum.arbeidsforhold.gjenopptak.soknadsdato-gjenopptak",
  "faktum.arbeidsforhold.arbeidstid-redusert-fra-dato",
];

export const futureDateAllowedWithWarningList = [
  "faktum.dagpenger-soknadsdato",
  "faktum.arbeidsforhold.gjenopptak.soknadsdato-gjenopptak",
];

export function useValidateFaktumDato(faktum: QuizFaktum): IUseValidateFaktumDato {
  const { getAppText } = useSanity();
  const { unansweredFaktumId } = useValidation();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!errorMessage) {
      setErrorMessage(
        unansweredFaktumId === faktum.id ? getAppText("validering.faktum.ubesvart") : undefined,
      );
    }
  }, [unansweredFaktumId]);

  // Validate input value
  // Set or clear validation message based on validation state
  // Return boolean validation state
  function validateAndIsValid(date: Date | null): boolean {
    setErrorMessage(undefined);

    if (!date) {
      setErrorMessage(getAppText("validering.ugyldig-dato"));
      return false;
    }

    const future = isFuture(date);
    const isValid = futureDateAllowedWithWarningList.includes(faktum.beskrivendeId)
      ? isWithinValidSoknadDatoRange(date)
      : isWithinValidDateRange(date);

    if (furetureDateAllowedList.includes(faktum.beskrivendeId)) {
      if (!isValid) {
        setErrorMessage(getAppText("validering.ugyldig-dato"));
      }

      return isValid;
    }

    if (!isValid) {
      setErrorMessage(getAppText("validering.ugyldig-dato"));
      return false;
    }

    if (future) {
      setErrorMessage(getAppText("validering.fremtidig-dato"));
      return false;
    }

    return !future && isValid;
  }

  function applicationDateIsOverTwoWeeks(date: Date) {
    return futureDateAllowedWithWarningList.includes(faktum.beskrivendeId) && isOverTwoWeeks(date);
  }

  function clearErrorMessage() {
    setErrorMessage(undefined);
  }

  return {
    errorMessage,
    validateAndIsValid,
    applicationDateIsOverTwoWeeks,
    clearErrorMessage,
  };
}
