import React, { ChangeEvent, useEffect, useState } from "react";
import { BodyShort, Label, TextField } from "@navikt/ds-react";
import { IFaktum } from "./Faktum";
import { PortableText } from "@portabletext/react";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";
import { IQuizNumberFaktum } from "../../types/quiz.types";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { HelpText } from "../HelpText";
import styles from "./Faktum.module.css";
import { isValidArbeidstimer, isValidPermitteringsPercent } from "./validations";

enum ValidationErrorTypes {
  EmptyValue,
  NegativeValue,
  InvalidValue,
}

export function FaktumNumber(props: IFaktum<IQuizNumberFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const { getAppTekst, getFaktumTextById } = useSanity();

  const faktumTexts = getFaktumTextById(props.faktum.beskrivendeId);
  const [debouncedValue, setDebouncedValue] = useState(props.faktum.svar);
  const debouncedChange = useDebouncedCallback(setDebouncedValue, 500);
  const [isValid, setIsValid] = useState<ValidationErrorTypes | boolean>(true);

  useEffect(() => {
    if (debouncedValue && debouncedValue !== props.faktum.svar) {
      onChange ? onChange(faktum, debouncedValue) : saveFaktum(debouncedValue);
    }
  }, [debouncedValue]);

  // Tmp conversion to int/float for saving to quiz
  //TODO Add som validation for different int vs float
  function onValueChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    if (!value) {
      setDebouncedValue(undefined);
      setIsValid(ValidationErrorTypes.EmptyValue);

      return;
    }

    switch (faktum.type) {
      case "int": {
        debouncedChange(parseInt(value));
        break;
      }
      case "double": {
        validateInput(parseInt(value));
        break;
      }

      default:
        // TODO sentry
        // eslint-disable-next-line no-console
        console.error("Wrong component for number. Could not parse text to int or float");
        break;
    }
  }

  function validateInput(value: number) {
    if (value < 0) {
      setIsValid(ValidationErrorTypes.NegativeValue);
      return false;
    }

    switch (faktum.beskrivendeId) {
      case "faktum.arbeidsforhold.permittert-prosent": {
        const isValid = isValidPermitteringsPercent(value);
        setIsValid(isValid ? true : ValidationErrorTypes.InvalidValue);
        return isValid;
      }
      case "faktum.arbeidsforhold.antall-timer-dette-arbeidsforhold": {
        const isValid = isValidArbeidstimer(value);
        setIsValid(isValid ? true : ValidationErrorTypes.InvalidValue);
        return isValid;
      }
      default: {
        setIsValid(true);
        return true;
      }
    }
  }

  function saveFaktum(value: number) {
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
      case ValidationErrorTypes.EmptyValue:
        return getAppTekst("validering.ugyldig.tom-eller-spesiell-tegn");
      case ValidationErrorTypes.NegativeValue:
        return getAppTekst("validering.ikke-negativt-tall");
      case ValidationErrorTypes.InvalidValue:
        return faktumTexts?.errorMessage ?? getAppTekst("validering.ugyldig.nummer");
      default:
        return faktumTexts?.errorMessage ?? getAppTekst("validering.ugyldig.nummer");
    }
  }

  return (
    <>
      <TextField
        defaultValue={debouncedValue?.toString()}
        label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
        description={faktumTexts?.description && <PortableText value={faktumTexts.description} />}
        step={faktum.type === "double" ? "0.1" : "1"}
        size="medium"
        type="number"
        onChange={onValueChange}
        onBlur={debouncedChange.flush}
        error={isValid !== true ? getErrorMessage() : undefined}
      />
      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
    </>
  );
}
