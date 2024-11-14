import { isFuture } from "date-fns";
import { useEffect, useState } from "react";
import {
  isOverTwoWeeks,
  isWithinValidDateRange,
} from "../../components/faktum/validation/validations.utils";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import { QuizFaktum } from "../../types/quiz.types";
import { SOKNAD_DATO_DATEPICKER_MAX_DATE, SOKNAD_DATO_DATEPICKER_MIN_DATE } from "../../constants";
interface IUseValidateFaktumDato {
  isValid: boolean;
  errorMessage: string | undefined;
  hasWarning: boolean;
  clearWarning: () => void;
  validateDate: (date: Date) => void;
  clearErrorMessage: () => void;
  setErrorMessage: (message: string) => void;
}

const allowFutureDate = [
  "faktum.arbeidsforhold.kontraktfestet-sluttdato",
  "faktum.arbeidsforhold.arbeidstid-redusert-fra-dato",
];

export const allowFutureDateWithWarning = [
  "faktum.dagpenger-soknadsdato",
  "faktum.arbeidsforhold.gjenopptak.soknadsdato-gjenopptak",
];

export function useValidateFaktumDato(faktum: QuizFaktum): IUseValidateFaktumDato {
  const { getAppText } = useSanity();
  const { unansweredFaktumId } = useValidation();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [isValid, setIsValid] = useState(false);
  const [hasWarning, setHasWarning] = useState(false);

  useEffect(() => {
    if (!errorMessage) {
      setErrorMessage(
        unansweredFaktumId === faktum.id ? getAppText("validering.faktum.ubesvart") : undefined,
      );
    }

    if (!isValid) {
      setHasWarning(false);
    }
  }, [unansweredFaktumId, isValid]);

  function validateDate(date: Date): void {
    setErrorMessage(undefined);

    if (allowFutureDateWithWarning.includes(faktum.beskrivendeId)) {
      if (date <= SOKNAD_DATO_DATEPICKER_MIN_DATE) {
        setErrorMessage(getAppText("validering.soknadsdato.for-langt-tilbake-i-tid"));
        setIsValid(false);
        return;
      }

      if (date >= SOKNAD_DATO_DATEPICKER_MAX_DATE) {
        setErrorMessage(getAppText("validering.soknadsdato.for-langt-frem-i-tid"));
        setIsValid(false);
        return;
      }

      if (isOverTwoWeeks(date)) {
        setHasWarning(true);
        setIsValid(true);
        return;
      }

      setIsValid(true);
      return;
    }

    if (allowFutureDate.includes(faktum.beskrivendeId)) {
      if (!isWithinValidDateRange(date)) {
        setErrorMessage(getAppText("validering.ugyldig-dato"));
        setIsValid(false);
        return;
      }

      setIsValid(true);
      return;
    }

    if (!isWithinValidDateRange(date)) {
      setErrorMessage(getAppText("validering.ugyldig-dato"));
      setIsValid(false);
      return;
    }

    if (isFuture(date)) {
      setErrorMessage(getAppText("validering.fremtidig-dato"));
      setIsValid(false);
      return;
    }
  }

  function clearErrorMessage() {
    setErrorMessage(undefined);
  }

  function clearWarning() {
    setHasWarning(false);
  }

  return {
    hasWarning,
    errorMessage,
    isValid,
    validateDate,
    clearErrorMessage,
    setErrorMessage,
    clearWarning,
  };
}
