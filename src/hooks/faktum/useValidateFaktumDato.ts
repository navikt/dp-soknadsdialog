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

export function useValidateFaktumDato(faktum: QuizFaktum): IUseValidateFaktumDato {
  const { getAppText } = useSanity();
  const { unansweredFaktumId } = useValidation();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    setErrorMessage(
      unansweredFaktumId === faktum.id ? getAppText("validering.faktum.ubesvart") : undefined
    );
  }, [unansweredFaktumId]);

  function isValid(date: Date) {
    const future = isFuture(date);
    const isValid = isWithinValidYearRange(date);

    setErrorMessage(undefined);

    // Future date is allowed for faktum.dagpenger-soknadsdato
    if (faktum.beskrivendeId === "faktum.dagpenger-soknadsdato") {
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
    return faktum.beskrivendeId === "faktum.dagpenger-soknadsdato" && isOverTwoWeeks(date);
  }

  return {
    errorMessage,
    isValid,
    getHasWarning,
  };
}
