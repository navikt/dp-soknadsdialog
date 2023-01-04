import { BodyShort, Label, TextField } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { ChangeEvent, forwardRef, Ref, useEffect, useState } from "react";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { useValidateFaktumNumber } from "../../hooks/faktum/useValidateFaktumNumber";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";
import { useFirstRender } from "../../hooks/useFirstRender";
import { IQuizNumberFaktum } from "../../types/quiz.types";
import { HelpText } from "../HelpText";
import { IFaktum } from "./Faktum";
import styles from "./Faktum.module.css";
import { isNumber } from "./validation/validations.utils";

export const FaktumNumber = forwardRef(FaktumNumberComponent);

function FaktumNumberComponent(
  props: IFaktum<IQuizNumberFaktum>,
  ref: Ref<HTMLInputElement> | undefined
) {
  const { faktum, onChange } = props;
  const isFirstRender = useFirstRender();
  const { saveFaktumToQuiz } = useQuiz();
  const { getFaktumTextById, getAppText } = useSanity();
  const { errorMessage, isValid, updateErrorMessage } = useValidateFaktumNumber(faktum);

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
      setDebouncedValue(null);
      return;
    }

    if (!isNumber(value)) {
      updateErrorMessage(getAppText("validering.number-faktum.maa-vaere-et-tall"));
      return;
    }

    switch (faktum.type) {
      case "int": {
        debouncedChange(parseInt(value));
        break;
      }
      case "double": {
        // Replace comma with dot
        const formattedValue = value.replace(/,/g, ".");
        debouncedChange(parseFloat(formattedValue));
        break;
      }
    }
  }

  function saveFaktum(value: number | null) {
    if (value && isValid(value)) {
      updateErrorMessage(undefined);
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
        ref={ref}
        tabIndex={-1}
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
        error={errorMessage}
      />
      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
    </>
  );
}
