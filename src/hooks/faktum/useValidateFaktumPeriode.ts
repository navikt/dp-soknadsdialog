import { isFuture } from "date-fns";
import { useEffect, useState } from "react";
import { isWithinValidYearRange } from "../../components/faktum/validation/validations.utils";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import { IQuizPeriodeFaktumAnswerType, QuizFaktum } from "../../types/quiz.types";

interface IUseValidateFaktumPeriode {
  isValid: (svar: IQuizPeriodeFaktumAnswerType) => boolean;
  fomErrorMessage: string | undefined;
  tomErrorMessage: string | undefined;
  clearTomErrorMessage: () => void;
}

export function useValidateFaktumPeriode(faktum: QuizFaktum): IUseValidateFaktumPeriode {
  const { getAppText } = useSanity();
  const { unansweredFaktumId } = useValidation();
  const [fomErrorMessage, setFomErrorMessage] = useState<string | undefined>(undefined);
  const [tomErrorMessage, setTomErrorMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (unansweredFaktumId === faktum.id) {
      setFomErrorMessage(getAppText("validering.faktum.ubesvart"));
    } else {
      setFomErrorMessage(undefined);
    }
  }, [unansweredFaktumId]);

  function isValid(svar: IQuizPeriodeFaktumAnswerType) {
    const { fom, tom } = svar;
    let isValidPeriode = true;

    const fomDateIsInfuture = isFuture(new Date(fom));
    const isValidFromDate = isWithinValidYearRange(new Date(fom));

    setFomErrorMessage(undefined);
    setTomErrorMessage(undefined);

    const specialCase =
      faktum.beskrivendeId === "faktum.arbeidsforhold.permittert-periode" ||
      faktum.beskrivendeId === "faktum.arbeidsforhold.naar-var-lonnsplikt-periode";

    // Future date is allowed on those two special cases
    if (specialCase && !isValidFromDate) {
      setFomErrorMessage(getAppText("validering.ugyldig-dato"));
      isValidPeriode = false;
    }

    if (fomDateIsInfuture && !specialCase) {
      setFomErrorMessage(getAppText("validering.fremtidig-dato"));
      isValidPeriode = false;
    }

    if (fomDateIsInfuture && faktum.beskrivendeId === "faktum.arbeidsforhold.varighet") {
      setFomErrorMessage(getAppText("validering.arbeidsforhold.varighet-fra"));
      isValidPeriode = false;
    }

    if (!isValidFromDate) {
      setFomErrorMessage(getAppText("validering.ugyldig-dato"));
      isValidPeriode = false;
    }

    if (tom && !isWithinValidYearRange(new Date(tom))) {
      setTomErrorMessage(getAppText("validering.ugyldig-dato"));
      isValidPeriode = false;
    }

    return isValidPeriode;
  }

  function clearTomErrorMessage() {
    setTomErrorMessage(undefined);
  }

  return {
    isValid,
    fomErrorMessage,
    tomErrorMessage,
    clearTomErrorMessage,
  };
}
