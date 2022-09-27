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
import { isValidNumber, isValidArbeidstimer, isValidPermitteringsPercent } from "./validations";

export function FaktumNumber(props: IFaktum<IQuizNumberFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const { getAppTekst, getFaktumTextById } = useSanity();

  const faktumTexts = getFaktumTextById(props.faktum.beskrivendeId);

  const [debouncedValue, setDebouncedValue] = useState(props.faktum.svar);
  const debouncedChange = useDebouncedCallback(setDebouncedValue, 500);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (debouncedValue && debouncedValue !== props.faktum.svar) {
      onChange ? onChange(faktum, debouncedValue) : saveFaktum(debouncedValue);
    }
  }, [debouncedValue]);

  // Tmp conversion to int/float for saving to quiz
  //TODO Add som validation for different int vs float
  function onValueChange(event: ChangeEvent<HTMLInputElement>) {
    let number;

    if (!event.target.value) {
      setDebouncedValue(undefined);
      return;
    }
    switch (faktum.type) {
      case "int": {
        number = parseInt(event.target.value);
        validateInput(number);
        debouncedChange(number);
        break;
      }
      case "double": {
        number = parseFloat(event.target.value);
        validateInput(number);
        debouncedChange(number);
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
    switch (faktum.beskrivendeId) {
      case "faktum.arbeidsforhold.permittert-prosent": {
        const isValid = isValidPermitteringsPercent(value);
        setIsValid(isValid);
        break;
      }
      case "faktum.arbeidsforhold.antall-timer-dette-arbeidsforhold": {
        const isValid = isValidArbeidstimer(value);
        setIsValid(isValid);
        break;
      }
      default: {
        const isValid = isValidNumber(value);
        setIsValid(isValid);
        break;
      }
    }
  }

  function saveFaktum(value: number) {
    if (isValid) {
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

  const errorText = faktumTexts?.errorMessage ?? getAppTekst("validering.ikke-negativt-tall");

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
        error={!isValid ? errorText : undefined}
      />
      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
    </>
  );
}
