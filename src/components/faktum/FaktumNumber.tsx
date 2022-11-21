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

export function FaktumNumber(props: IFaktum<IQuizNumberFaktum>) {
  const { faktum, onChange } = props;
  const { saveFaktumToQuiz } = useQuiz();
  const { getFaktumTextById } = useSanity();
  const {
    setHasError: setHasError,
    isValidInput,
    getErrorMessage,
  } = useValidateFaktumNumber(faktum.beskrivendeId);
  const faktumTexts = getFaktumTextById(props.faktum.beskrivendeId);

  const [debouncedValue, setDebouncedValue] = useState<number | null | undefined>(
    props.faktum.svar
  );
  const debouncedChange = useDebouncedCallback(setDebouncedValue, 500);

  useEffect(() => {
    if (debouncedValue !== undefined && debouncedValue !== props.faktum.svar) {
      onChange ? onChange(faktum, debouncedValue) : saveFaktum(debouncedValue);
    }
  }, [debouncedValue]);

  function onValueChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    if (!value) {
      setHasError(false);
      debouncedChange(null);
      return;
    }

    if (!isNumber(value)) {
      setHasError("notNumber");
      debouncedChange(undefined);
      return;
    }

    switch (faktum.type) {
      case "int": {
        setHasError(false);
        debouncedChange(parseInt(value));
        break;
      }
      case "double": {
        setHasError(false);
        // Replace comma with dot
        const formattedValue = value.replace(/,/g, ".");
        debouncedChange(parseFloat(formattedValue));
        break;
      }

      default:
        break;
    }
  }

  function saveFaktum(value: number | null) {
    const isValid = isValidInput(value);
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

  // Replace dot with comma
  const displayValue = debouncedValue?.toString().replace(/\./g, ",");

  return (
    <>
      <TextField
        className={styles.faktumNumber}
        defaultValue={displayValue}
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
