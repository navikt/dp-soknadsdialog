import { isFuture } from "date-fns";
import { useEffect, useState } from "react";
import {
  isOverTwoWeeks,
  isWithinValidDateRange,
} from "../../components/faktum/validation/validations.utils";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import { QuizFaktum } from "../../types/quiz.types";
import { SOKNAD_DATO_DATEPICKER_TO_DATE, SOKNAD_DATO_DATEPICKER_FROM_DATE } from "../../constants";
interface IUseValidateFaktumDato {
  validateAndIsValid: (date: Date) => boolean;
  shouldShowWarning: (date: Date) => boolean;
  error: string | undefined;
  setError: (message: string) => void;
}

const furetureDateAllowedList = [
  "faktum.arbeidsforhold.kontraktfestet-sluttdato",
  "faktum.arbeidsforhold.arbeidstid-redusert-fra-dato",
];

export const futureDateAllowedWithWarningList = [
  "faktum.dagpenger-soknadsdato",
  "faktum.arbeidsforhold.gjenopptak.soknadsdato-gjenopptak",
];

export function useValidateFaktumDato(faktum: QuizFaktum): IUseValidateFaktumDato {
  const { getAppText } = useSanity();
  const { unansweredFaktumId } = useValidation();
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!error) {
      setError(
        unansweredFaktumId === faktum.id ? getAppText("validering.faktum.ubesvart") : undefined,
      );
    }
  }, [unansweredFaktumId]);

  // Validate input value
  // Set or clear validation message based on validation state
  // Return boolean validation state
  function validateAndIsValid(date: Date): boolean {
    setError(undefined);

    if (futureDateAllowedWithWarningList.includes(faktum.beskrivendeId)) {
      if (date <= SOKNAD_DATO_DATEPICKER_FROM_DATE) {
        setError(getAppText("validering.soknadsdato.for-langt-tilbake-i-tid"));
        return false;
      }

      if (date >= SOKNAD_DATO_DATEPICKER_TO_DATE) {
        setError(getAppText("validering.soknadsdato.for-langt-frem-i-tid"));
        return false;
      }

      return true;
    }

    const future = isFuture(date);
    const isValid = isWithinValidDateRange(date);

    if (furetureDateAllowedList.includes(faktum.beskrivendeId)) {
      if (!isValid) {
        setError(getAppText("validering.ugyldig-dato"));
      }

      return isValid;
    }

    if (!isValid) {
      setError(getAppText("validering.ugyldig-dato"));
      return false;
    }

    if (future) {
      setError(getAppText("validering.fremtidig-dato"));
      return false;
    }

    return !future && isValid;
  }

  function shouldShowWarning(date: Date) {
    return (
      futureDateAllowedWithWarningList.includes(faktum.beskrivendeId) &&
      isOverTwoWeeks(date) &&
      !error
    );
  }

  return {
    error,
    validateAndIsValid,
    shouldShowWarning,
    setError,
  };
}
