import { useEffect, useState } from "react";
import {
  isValidArbeidstimer,
  isValidPermitteringsPercent,
} from "../../components/faktum/validation/validations.utils";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import { QuizFaktum } from "../../types/quiz.types";

interface IUseValidateFaktumNumber {
  isValid: (value: number | null) => boolean;
  errorMessage: string | undefined;
  updateErrorMessage: (message: string | undefined) => void;
}

export function useValidateFaktumNumber({
  id,
  beskrivendeId,
}: QuizFaktum): IUseValidateFaktumNumber {
  const { getAppText, getFaktumTextById } = useSanity();
  const { unansweredFaktumId } = useValidation();
  const faktumTexts = getFaktumTextById(beskrivendeId);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!errorMessage) {
      setErrorMessage(
        unansweredFaktumId === id ? getAppText("validering.faktum.ubesvart") : undefined
      );
    }
  }, [unansweredFaktumId]);

  function isValid(value: number | null) {
    if (beskrivendeId === "faktum.egen-naering-organisasjonsnummer") {
      // Generator faktum "egen næring" contains only one faktum (faktum.egen-naering-organisasjonsnummer).
      // We cannot save null because it will close generator faktum modal
      if (value === null) {
        setErrorMessage(getAppText("validering.number-faktum.tom-svar"));
        return false;
      }

      if (value?.toString().length !== 9) {
        setErrorMessage(
          getAppText("faktum.egen-naering-organisasjonsnummer.validering-maa-vaere-ni-siffer")
        );
        return false;
      }

      return true;
    }

    if (value === null) return true;

    if (value === 0) return true;

    if (value && beskrivendeId === "faktum.arbeidsforhold.permittert-prosent") {
      if (!isValidPermitteringsPercent(value)) {
        setErrorMessage(
          faktumTexts?.errorMessage ?? getAppText("validering.number-faktum.ugyldig")
        );

        return false;
      }

      return true;
    }

    if (value && beskrivendeId === "faktum.arbeidsforhold.antall-timer-jobbet") {
      if (!isValidArbeidstimer(value)) {
        setErrorMessage(
          faktumTexts?.errorMessage ?? getAppText("validering.number-faktum.ugyldig")
        );

        return false;
      }

      return true;
    }

    return true;
  }

  function updateErrorMessage(message: string | undefined) {
    setErrorMessage(message);
  }

  return {
    isValid,
    errorMessage,
    updateErrorMessage,
  };
}
