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
  isValid: (date: Date) => boolean | ((date: Date) => boolean);
  getHasWarning: (date: Date) => boolean;
  errorMessage: string | undefined;
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
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!errorMessage) {
      setErrorMessage(
        unansweredFaktumId === faktum.id ? getAppText("validering.faktum.ubesvart") : undefined
      );
    }
  }, [unansweredFaktumId]);

  function isValid(date: Date) {
    const future = isFuture(date);
    const isValid = isWithinValidYearRange(date);

    setErrorMessage(undefined);

    if (furetureDateAllowedList.includes(faktum.beskrivendeId)) {
      if (!isValid) {
        setErrorMessage(getAppText("validering.ugyldig-dato"));
      }

      return isValid;
    }

    if (!isValid) {
      setErrorMessage(getAppText("validering.ugyldig-dato"));
    }

    if (future) {
      setErrorMessage(getAppText("validering.fremtidig-dato"));
    }

    return isValid && !future;
  }

  function getHasWarning(date: Date) {
    return futureDateAllowedWithWarningList.includes(faktum.beskrivendeId) && isOverTwoWeeks(date);
  }

  return {
    errorMessage,
    isValid,
    getHasWarning,
  };
}
