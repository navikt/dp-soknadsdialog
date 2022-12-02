import { isFuture } from "date-fns";
import { useState } from "react";
import { isFromYear1900 } from "../../components/faktum/validation/validations.utils";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import { IQuizPeriodeFaktumAnswerType, QuizFaktum } from "../../types/quiz.types";

type validationFomDateErrorType = "FutureDate" | "InvalidDate";

interface IUseValidateFaktumPeriode {
  getFomErrorMessage: () => string | undefined;
  getTomErrorMessage: () => string | undefined;
  isValid: (svar: IQuizPeriodeFaktumAnswerType) => boolean;
}

export function useValidateFaktumPeriode(faktum: QuizFaktum): IUseValidateFaktumPeriode {
  const { getAppText, getFaktumTextById } = useSanity();
  const { unansweredFaktumId } = useValidation();
  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);
  const [hasFomError, setHasFomError] = useState<validationFomDateErrorType | undefined>(undefined);
  const [hasTomError, setHasTomError] = useState<string | undefined>(undefined);

  function isValid(svar: IQuizPeriodeFaktumAnswerType) {
    const { fom, tom } = svar;
    let validPeriode = true;

    if (fom) {
      const future = isFuture(new Date(fom));
      const isValidFromDate = isFromYear1900(new Date(fom));

      if (
        faktum.beskrivendeId === "faktum.arbeidsforhold.permittert-periode" ||
        faktum.beskrivendeId === "faktum.arbeidsforhold.naar-var-lonnsplikt-periode"
      ) {
        setHasFomError(!isValidFromDate ? "InvalidDate" : undefined);
        validPeriode = isValidFromDate;
      } else {
        if (!isValidFromDate) {
          setHasFomError("InvalidDate");
        } else if (future) {
          setHasFomError("FutureDate");
        } else {
          setHasFomError(undefined);
        }

        validPeriode = !future && isValidFromDate;
      }
    }

    if (tom) {
      const afterYear1900 = isFromYear1900(new Date(tom));

      if (!afterYear1900) {
        setHasTomError("InvalidDate");
      } else {
        setHasTomError(undefined);
      }

      validPeriode = afterYear1900;
    }

    return validPeriode;
  }

  function getFomErrorMessageByRule() {
    if (faktum.beskrivendeId === "faktum.arbeidsforhold.varighet") {
      return hasFomError === "FutureDate"
        ? getAppText("validering.arbeidsforhold.varighet-fra")
        : getAppText("validering.ugyldig-dato");
    } else if (hasFomError === "InvalidDate") {
      return getAppText("validering.ugyldig-dato");
    } else {
      return faktumTexts?.errorMessage ? faktumTexts.errorMessage : faktum.beskrivendeId;
    }
  }

  function getFomErrorMessage() {
    if (hasFomError) {
      return getFomErrorMessageByRule();
    } else if (unansweredFaktumId === faktum.id) {
      return getAppText("validering.faktum.ubesvart");
    } else {
      return undefined;
    }
  }

  function getTomErrorMessage() {
    if (hasTomError && faktum.beskrivendeId === "faktum.arbeidsforhold.varighet") {
      return hasTomError === "InvalidDate"
        ? getAppText("validering.ugyldig-dato")
        : getAppText("validering.arbeidsforhold.varighet-til");
    } else if (hasTomError === "InvalidDate") {
      return getAppText("validering.ugyldig-dato");
    } else {
      return undefined;
    }
  }

  return {
    getFomErrorMessage,
    getTomErrorMessage,
    isValid,
  };
}
