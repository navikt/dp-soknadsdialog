import { isFuture } from "date-fns";
import { useState } from "react";
import { isFromYear1900 } from "../../components/faktum/validation/validations.utils";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import { IQuizPeriodeFaktumAnswerType, QuizFaktum } from "../../types/quiz.types";

type validationFomDateErrorType = "futureDate" | "invalidDate";
type validationTomDateErrorType = "isBeforeFomDate" | "invalidDate";

interface IProps {
  getFomErrorMessage: () => string | undefined;
  getTomErrorMessage: () => string | undefined;
  isValidPeriode: (svar: IQuizPeriodeFaktumAnswerType) => boolean;
}

export function useValidateFaktumPeriode(faktum: QuizFaktum): IProps {
  const { getAppText, getFaktumTextById } = useSanity();
  const { unansweredFaktumId } = useValidation();
  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);
  const [hasFomError, setHasFomError] = useState<validationFomDateErrorType | boolean>(false);
  const [hasTomError, setHasTomError] = useState<validationTomDateErrorType | boolean>(false);

  function isValidPeriode(svar: IQuizPeriodeFaktumAnswerType) {
    const { fom, tom } = svar;
    let validPeriode = true;

    if (fom) {
      const future = isFuture(new Date(fom));
      const isValidFromDate = isFromYear1900(new Date(fom));

      if (future) {
        setHasFomError("futureDate");
      } else if (!isValidFromDate) {
        setHasFomError("invalidDate");
      } else {
        setHasFomError(false);
      }

      validPeriode = !future && isValidFromDate;
    }

    if (tom) {
      const tomDate = new Date(tom).getTime();
      const fomDate = new Date(fom).getTime();

      const isValidTomDate = tomDate >= fomDate;
      const afterYear1900 = isFromYear1900(new Date(fom));

      if (!isValidTomDate) {
        setHasTomError("isBeforeFomDate");
      } else if (!afterYear1900) {
        setHasTomError("invalidDate");
      } else {
        setHasTomError(false);
      }

      validPeriode = isValidTomDate && afterYear1900;
    }

    return validPeriode;
  }

  function getFomErrorMessageByRule() {
    if (faktum.beskrivendeId === "faktum.arbeidsforhold.varighet") {
      return hasFomError === "futureDate"
        ? getAppText("validering.arbeidsforhold.varighet-fra")
        : getAppText("validering.ugyldig-dato");
    } else if (hasFomError === "invalidDate") {
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

  // Todo rydd opp dette
  // Bytte teksten for validering.arbeidsforhold.varighet-til tibake til ugyldig dato
  function getTomErrorMessage() {
    if (hasTomError && faktum.beskrivendeId === "faktum.arbeidsforhold.varighet") {
      return hasTomError === "invalidDate"
        ? getAppText("validering.arbeidsforhold.varighet-til")
        : getAppText("validering.ugyldig-dato");
    } else if (hasTomError === "invalidDate") {
      return getAppText("validering.ugyldig-dato");
    } else {
      return undefined;
    }
  }

  return {
    getFomErrorMessage,
    getTomErrorMessage,
    isValidPeriode,
  };
}
