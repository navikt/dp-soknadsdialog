import { isFuture } from "date-fns";
import { useEffect, useState } from "react";
import { isWithinValidDateRange } from "../../components/faktum/validation/validations.utils";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import { QuizFaktum } from "../../types/quiz.types";
import { IPeriodeFaktumSvar } from "../../components/faktum/faktum-periode/FaktumPeriode";

interface IUseValidateFaktumPeriode {
  validateAndIsValidPeriode: (svar: IPeriodeFaktumSvar) => boolean;
  fromError: string | undefined;
  toError: string | undefined;
  setFromError: (message: string) => void;
  setToError: (message: string) => void;
}

const futureDateAllowedList = [
  "faktum.arbeidsforhold.permittert-periode",
  "faktum.arbeidsforhold.naar-var-lonnsplikt-periode",
];

export function useValidateFaktumPeriode(faktum: QuizFaktum): IUseValidateFaktumPeriode {
  const { getAppText } = useSanity();
  const { unansweredFaktumId } = useValidation();
  const [fromError, setFromError] = useState<string | undefined>(undefined);
  const [toError, setToError] = useState<string | undefined>(undefined);

  useEffect(() => {
    setFromError(
      unansweredFaktumId === faktum.id ? getAppText("validering.faktum.ubesvart") : undefined,
    );
  }, [unansweredFaktumId]);

  function validateAndIsValidPeriode(svar: IPeriodeFaktumSvar) {
    const { fom, tom } = svar;

    if (fom === null) {
      setFromError(getAppText("validering.ugyldig-dato"));
      return false;
    }

    if (tom === null) {
      setToError(getAppText("validering.ugyldig-dato"));
      return false;
    }

    const fomDateIsInfuture = isFuture(new Date(fom));
    const isValidFromDate = isWithinValidDateRange(new Date(fom));

    setFromError(undefined);
    setToError(undefined);

    const specialCase = futureDateAllowedList.includes(faktum.beskrivendeId);
    let isValidPeriode = true;

    // Future date is allowed on those two special cases
    if (specialCase && !isValidFromDate) {
      setFromError(getAppText("validering.ugyldig-dato"));
      isValidPeriode = false;
    }

    if (fomDateIsInfuture && !specialCase) {
      setFromError(getAppText("validering.fremtidig-dato"));
      isValidPeriode = false;
    }

    if (fomDateIsInfuture && faktum.beskrivendeId === "faktum.arbeidsforhold.varighet") {
      setFromError(getAppText("validering.arbeidsforhold.varighet-fra"));
      isValidPeriode = false;
    }

    if (!isValidFromDate) {
      setFromError(getAppText("validering.ugyldig-dato"));
      isValidPeriode = false;
    }

    if (tom && !isWithinValidDateRange(new Date(tom))) {
      setToError(getAppText("validering.ugyldig-dato"));
      isValidPeriode = false;
    }

    return isValidPeriode;
  }

  return {
    validateAndIsValidPeriode,
    fromError,
    setFromError,
    setToError,
    toError,
  };
}
