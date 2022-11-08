import { BodyShort, Label, TextField } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { ChangeEvent, useEffect, useState } from "react";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";
import { IQuizNumberFaktum } from "../../types/quiz.types";
import { HelpText } from "../HelpText";
import { IFaktum } from "./Faktum";
import styles from "./Faktum.module.css";
import {
  isNumber,
  isValidArbeidstimer,
  isValidPermitteringsPercent,
} from "./validation/validations.utils";

enum ValidationErrorTypes {
  IsNegativeValue,
  IsInvalidValue,
  IsNotNumber,
}

export function FaktumNumber(props: IFaktum<IQuizNumberFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const { unansweredFaktumId } = useValidation();
  const { getAppText, getFaktumTextById } = useSanity();
  const faktumTexts = getFaktumTextById(props.faktum.beskrivendeId);
  const [isValid, setIsValid] = useState<ValidationErrorTypes | boolean>();

  const [debouncedValue, setDebouncedValue] = useState<number | null | undefined>(
    props.faktum.svar
  );
  const debouncedChange = useDebouncedCallback(setDebouncedValue, 500);

  useEffect(() => {
    if (debouncedValue !== undefined && faktum.svar !== debouncedValue) {
      onChange ? onChange(faktum, debouncedValue) : saveFaktum(debouncedValue);
    }
  }, [debouncedValue]);

  // Tmp conversion to int/float for saving to quiz
  //TODO Add som validation for different int vs float
  function onValueChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    if (!value) {
      debouncedChange(null);
      setIsValid(true);
      return;
    }

    if (!isNumber(value)) {
      setIsValid(ValidationErrorTypes.IsNotNumber);
      return;
    }

    switch (faktum.type) {
      case "int": {
        debouncedChange(parseInt(value));
        break;
      }
      case "double": {
        debouncedChange(parseFloat(value));
        break;
      }

      default:
        // TODO sentry
        // eslint-disable-next-line no-console
        console.error("Wrong component for number. Could not parse text to int or float");
        break;
    }
  }

  function validateInput(value: number | null) {
    if (value === null || value === 0) {
      setIsValid(true);
      return true;
    }

    if (value < 0) {
      setIsValid(ValidationErrorTypes.IsNegativeValue);
      return false;
    }

    switch (faktum.beskrivendeId) {
      case "faktum.arbeidsforhold.permittert-prosent": {
        const isValid = isValidPermitteringsPercent(value);
        setIsValid(isValid ? true : ValidationErrorTypes.IsInvalidValue);
        return isValid;
      }
      case "faktum.arbeidsforhold.antall-timer-dette-arbeidsforhold": {
        const isValid = isValidArbeidstimer(value);
        setIsValid(isValid ? true : ValidationErrorTypes.IsInvalidValue);
        return isValid;
      }
      default: {
        setIsValid(true);
        return true;
      }
    }
  }

  function saveFaktum(value: number | null) {
    const isValidInput = validateInput(value);

    if (isValidInput) {
      saveFaktumToQuiz(faktum, value);
    }
  }

  if (props.faktum.readOnly || props.readonly) {
    return (
      <>
        <Label>{faktumTexts ? faktumTexts.text : faktum.beskrivendeId}</Label>
        <BodyShort>{debouncedValue}</BodyShort>
      </>
    );
  }

  function getErrorMessage() {
    switch (isValid) {
      case ValidationErrorTypes.IsNegativeValue:
        return getAppText("validering.number-faktum.ikke-negativt-tall");
      case ValidationErrorTypes.IsNotNumber:
        return getAppText("validering.number-faktum.maa-vaere-et-tall");
      case ValidationErrorTypes.IsInvalidValue:
        return faktumTexts?.errorMessage ?? getAppText("validering.number-faktum.ugyldig");
      default:
        return undefined;
    }
  }

  function getValidationMessage() {
    if (unansweredFaktumId === faktum.id) {
      return getAppText("validering.faktum.ubesvart");
    } else if (isValid !== true) {
      return getErrorMessage();
    } else {
      undefined;
    }
  }

  return (
    <>
      <TextField
        className={styles.faktumNumber}
        defaultValue={debouncedValue?.toString()}
        label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
        description={faktumTexts?.description && <PortableText value={faktumTexts.description} />}
        size="medium"
        type="text"
        inputMode="numeric"
        onChange={onValueChange}
        onBlur={debouncedChange.flush}
        error={getValidationMessage()}
      />
      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
    </>
  );
}
