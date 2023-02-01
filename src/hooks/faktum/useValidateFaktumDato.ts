import { isFuture } from "date-fns";
import { useEffect, useState } from "react";
import {
  isOverTwoWeeks,
  isWithinValidYearRange,
} from "../../components/faktum/validation/validations.utils";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import { QuizFaktum } from "../../types/quiz.types";
interface IUseValidateFaktumDato {
  validateDate: (date: Date | null) => void | ((date: Date | null) => void);
  getHasWarning: (date: Date) => boolean;
  errorMessage: string | undefined;
  clearErrorMessage: () => void;
  isValidDate: boolean;
}

const furetureDateAllowedList = [
  "faktum.dagpenger-soknadsdato",
  "faktum.arbeidsforhold.kontraktfestet-sluttdato",
  "faktum.arbeidsforhold.gjenopptak.soknadsdato-gjenopptak",
];

const futureDateAllowedWithWarningList = [
  "faktum.dagpenger-soknadsdato",
  "faktum.arbeidsforhold.gjenopptak.soknadsdato-gjenopptak",
];

export function useValidateFaktumDato(faktum: QuizFaktum): IUseValidateFaktumDato {
  const { getAppText } = useSanity();
  const { unansweredFaktumId } = useValidation();
  const [isValidDate, setIsValidDate] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!errorMessage) {
      setErrorMessage(
        unansweredFaktumId === faktum.id ? getAppText("validering.faktum.ubesvart") : undefined
      );
    }
  }, [unansweredFaktumId]);

  function validateDate(date: Date | null) {
    setErrorMessage(undefined);

    if (!date) {
      setErrorMessage(getAppText("validering.ugyldig-dato"));
      setIsValidDate(false);
      return;
    }

    const future = isFuture(date);
    const isValid = isWithinValidYearRange(date);

    if (furetureDateAllowedList.includes(faktum.beskrivendeId)) {
      if (!isValid) {
        setErrorMessage(getAppText("validering.ugyldig-dato"));
      }

      setIsValidDate(isValid);
      return;
    }

    if (!isValid) {
      setErrorMessage(getAppText("validering.ugyldig-dato"));
      setIsValidDate(false);
      return;
    }

    if (future) {
      setErrorMessage(getAppText("validering.fremtidig-dato"));
      setIsValidDate(false);
      return;
    }

    setIsValidDate(true);
  }

  function getHasWarning(date: Date) {
    return futureDateAllowedWithWarningList.includes(faktum.beskrivendeId) && isOverTwoWeeks(date);
  }

  function clearErrorMessage() {
    setErrorMessage(undefined);
  }

  return {
    errorMessage,
    validateDate,
    getHasWarning,
    clearErrorMessage,
    isValidDate,
  };
}
