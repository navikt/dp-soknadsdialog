import { isFuture } from "date-fns";
import { useEffect, useState } from "react";
import { isWithinValidYearRange } from "../../components/faktum/validation/validations.utils";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import { IQuizPeriodeFaktumAnswerType, QuizFaktum } from "../../types/quiz.types";

interface IUseValidateFaktumPeriode {
  validateAndIsValidPeriode: (svar: IQuizPeriodeFaktumAnswerType) => boolean;
  fomErrorMessage: string | undefined;
  tomErrorMessage: string | undefined;
  clearErrorMessage: () => void;
}

export function useValidateFaktumPeriode(faktum: QuizFaktum): IUseValidateFaktumPeriode {
  const { getAppText } = useSanity();
  const { unansweredFaktumId } = useValidation();
  const [fomErrorMessage, setFomErrorMessage] = useState<string | undefined>(undefined);
  const [tomErrorMessage, setTomErrorMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    setFomErrorMessage(
      unansweredFaktumId === faktum.id ? getAppText("validering.faktum.ubesvart") : undefined
    );
  }, [unansweredFaktumId]);

  function validateAndIsValidPeriode(svar: IQuizPeriodeFaktumAnswerType) {
    const { fom, tom } = svar;

    if (fom === null) {
      setFomErrorMessage(getAppText("validering.ugyldig-dato"));
      return false;
    }

    if (tom === null) {
      setTomErrorMessage(getAppText("validering.ugyldig-dato"));
      return false;
    }

    const fomDateIsInfuture = isFuture(new Date(fom));
    const isValidFromDate = isWithinValidYearRange(new Date(fom));

      setFomErrorMessage(undefined);
      setTomErrorMessage(undefined);

      const specialCase =
        faktum.beskrivendeId === "faktum.arbeidsforhold.permittert-periode" ||
        faktum.beskrivendeId === "faktum.arbeidsforhold.naar-var-lonnsplikt-periode";

      let isValidPeriode = true;

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

  function clearErrorMessage() {
    setFomErrorMessage(undefined);
    setTomErrorMessage(undefined);
  }

  return {
    validateAndIsValidPeriode,
    fomErrorMessage,
    tomErrorMessage,
    clearErrorMessage,
  };
}
