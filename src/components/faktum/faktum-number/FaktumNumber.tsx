import { ChangeEvent, forwardRef, Ref, useEffect, useState } from "react";
import { TextField } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { IQuizNumberFaktum } from "../../../types/quiz.types";
import { IFaktum } from "../Faktum";
import { useSoknad } from "../../../context/soknad-context";
import { useSanity } from "../../../context/sanity-context";
import { useValidateFaktumNumber } from "../../../hooks/validation/useValidateFaktumNumber";
import { useDebouncedCallback } from "../../../hooks/useDebouncedCallback";
import { HelpText } from "../../HelpText";
import { isNumber } from "../validation/validations.utils";
import { useFirstRender } from "../../../hooks/useFirstRender";
import styles from "../Faktum.module.css";

export const FaktumNumber = forwardRef(FaktumNumberComponent);

function FaktumNumberComponent(
  props: IFaktum<IQuizNumberFaktum>,
  ref: Ref<HTMLInputElement> | undefined,
) {
  const { faktum } = props;
  const isFirstRender = useFirstRender();
  const { saveFaktumToQuiz, isLocked } = useSoknad();
  const { getFaktumTextById, getAppText } = useSanity();
  const { errorMessage, isValid, updateErrorMessage } = useValidateFaktumNumber(faktum);

  const faktumTexts = getFaktumTextById(props.faktum.beskrivendeId);
  const [currentAnswer, setCurrentAnswer] = useState<string>(faktum.svar?.toString() ?? "");
  const [debouncedValue, setDebouncedValue] = useState<number | null>(faktum.svar || null);
  const debouncedChange = useDebouncedCallback(setDebouncedValue, 500);

  useEffect(() => {
    if (!isFirstRender && debouncedValue !== faktum.svar) {
      saveFaktum(debouncedValue);
    }
  }, [debouncedValue]);

  // Used to reset current answer to what the backend state is if there is a mismatch
  useEffect(() => {
    if (!isFirstRender && faktum.svar !== debouncedValue) {
      setCurrentAnswer(faktum.svar ? faktum.svar.toString() : "");
    }
  }, [faktum]);

  function onValueChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    const inputValue = value.trim();

    setCurrentAnswer(inputValue);
    updateErrorMessage(undefined);

    if (!inputValue) {
      setDebouncedValue(null);
      return;
    }

    if (!isNumber(inputValue)) {
      updateErrorMessage(getAppText("validering.number-faktum.maa-vaere-et-tall"));
      return;
    }

    if (parseInt(inputValue) < 0) {
      updateErrorMessage(getAppText("validering.number-faktum.ikke-negativt-tall"));
      return;
    }

    switch (faktum.type) {
      case "int": {
        debouncedChange(parseInt(inputValue));
        break;
      }
      case "double": {
        // Replace comma with dot
        const formattedValue = inputValue.replace(/,/g, ".");
        debouncedChange(parseFloat(formattedValue));
        break;
      }
    }
  }

  function saveFaktum(value: number | null) {
    if (isValid(value)) {
      saveFaktumToQuiz(faktum, value);
    }
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
        disabled={isLocked}
      />

      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
    </>
  );
}
