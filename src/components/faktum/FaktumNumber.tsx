import { BodyShort, Label, TextField } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { ChangeEvent, useEffect, useState } from "react";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { useValidateFaktumNumber } from "../../hooks/faktum/useValidateFaktumNumber";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";
import { IQuizNumberFaktum } from "../../types/quiz.types";
import { HelpText } from "../HelpText";
import { IFaktum } from "./Faktum";
import styles from "./Faktum.module.css";
import { isNumber } from "./validation/validations.utils";
import { useFirstRender } from "../../hooks/useFirstRender";

export function FaktumNumber(props: IFaktum<IQuizNumberFaktum>) {
  const { faktum, onChange } = props;
  const isFirstRender = useFirstRender();
  const { saveFaktumToQuiz } = useQuiz();
  const { getFaktumTextById } = useSanity();
  const { setHasError, isValid, getErrorMessage } = useValidateFaktumNumber(faktum.beskrivendeId);

  const faktumTexts = getFaktumTextById(props.faktum.beskrivendeId);
  const [currentAnswer, setCurrentAnswer] = useState<string>(faktum.svar?.toString() || "");
  const [debouncedValue, setDebouncedValue] = useState<number | null>(faktum.svar || null);
  const debouncedChange = useDebouncedCallback(setDebouncedValue, 500);

  useEffect(() => {
    if (!isFirstRender && debouncedValue !== faktum.svar) {
      onChange ? onChange(faktum, debouncedValue) : saveFaktum(debouncedValue);
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (faktum.svar === undefined && !isFirstRender) {
      setCurrentAnswer("");
    }
  }, [faktum.svar]);

  function onValueChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setCurrentAnswer(value);

    if (!value) {
      setHasError(undefined);
      setDebouncedValue(null);
      return;
    }

    if (!isNumber(value)) {
      setHasError("NotNumber");
      return;
    }

    switch (faktum.type) {
      case "int": {
        setHasError(undefined);
        debouncedChange(parseInt(value));
        break;
      }
      case "double": {
        setHasError(undefined);
        // Replace comma with dot
        const formattedValue = value.replace(/,/g, ".");
        debouncedChange(parseFloat(formattedValue));
        break;
      }
    }
  }

  function saveFaktum(value: number | null) {
    const isValidNumber = isValid(value);
    if (isValidNumber) {
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

  // Replace dot with comma
  const displayValue = currentAnswer.replace(/\./g, ",");

  return (
    <>
      <TextField
        className={styles.faktumNumber}
        value={displayValue}
        label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
        description={faktumTexts?.description && <PortableText value={faktumTexts.description} />}
        size="medium"
        type="text"
        maxLength={9}
        inputMode="decimal"
        onChange={onValueChange}
        onBlur={debouncedChange.flush}
        error={getErrorMessage(props.faktum.id)}
      />
      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
    </>
  );
}
