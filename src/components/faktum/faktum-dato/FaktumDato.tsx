import { DatePicker, useDatepicker } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { formatISO } from "date-fns";
import { Ref, forwardRef, useEffect, useState } from "react";
import {
  DATEPICKER_MAX_DATE,
  DATEPICKER_MIN_DATE,
  SOKNAD_DATO_DATEPICKER_MAX_DATE,
  SOKNAD_DATO_DATEPICKER_MIN_DATE,
} from "../../../constants";
import { useQuiz } from "../../../context/quiz-context";
import { useSanity } from "../../../context/sanity-context";
import { useValidation } from "../../../context/validation-context";
import { useDebouncedCallback } from "../../../hooks/useDebouncedCallback";
import { useFirstRender } from "../../../hooks/useFirstRender";
import {
  allowFutureDateWithWarning,
  useValidateFaktumDato,
} from "../../../hooks/validation/useValidateFaktumDato";
import { IQuizDatoFaktum } from "../../../types/quiz.types";
import { HelpText } from "../../HelpText";
import { IFaktum } from "../Faktum";
import styles from "../Faktum.module.css";
import { FaktumDatoWarning } from "./FaktumDatoWarning";

export const FaktumDato = forwardRef(FaktumDatoComponent);

function FaktumDatoComponent(
  props: IFaktum<IQuizDatoFaktum>,
  ref: Ref<HTMLDivElement> | undefined,
) {
  const { faktum } = props;
  const isFirstRender = useFirstRender();
  const { saveFaktumToQuiz, isLocked } = useQuiz();
  const { getFaktumTextById, getAppText } = useSanity();
  const { unansweredFaktumId } = useValidation();
  const {
    errorMessage,
    isValid,
    hasWarning,
    validateDate,
    clearErrorMessage,
    clearWarning,
    setErrorMessage,
  } = useValidateFaktumDato(faktum);
  const faktumTexts = getFaktumTextById(props.faktum.beskrivendeId);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(props.faktum.svar ?? "");
  const [debouncedDate, setDebouncedDate] = useState<string | null>(currentAnswer);
  const debouncedChange = useDebouncedCallback(setDebouncedDate, 500);

  useEffect(() => {
    if (!isFirstRender) {
      saveFaktum(debouncedDate);
    }
  }, [debouncedDate]);

  // Used to reset current answer to what the backend state is if there is a mismatch
  useEffect(() => {
    if (!isFirstRender && faktum.svar !== currentAnswer) {
      setCurrentAnswer(faktum.svar ?? "");
    }
  }, [faktum]);

  const { datepickerProps, inputProps } = useDatepicker({
    defaultSelected: currentAnswer ? new Date(currentAnswer) : undefined,
    onDateChange: (value?: Date) => {
      if (value) {
        const debounceValue = formatISO(value, { representation: "date" });
        setCurrentAnswer(debounceValue);
        debouncedChange(debounceValue);
      }
    },
    onValidate: (value) => {
      if (value.isEmpty) {
        setCurrentAnswer("");
        debouncedChange("");
        clearErrorMessage();
      }

      if (value.isInvalid) {
        clearWarning();
      }
    },
  });

  // Validere når onBlur trigges når bruker skriver inn dato manuelt.
  function validateOnBlur() {
    const regEx = /^(?:(\d{2})\.?(\d{2})\.?(\d{2}|\d{4})|\d{2}\.\d{2}\.\d{4})$/;

    // Her skal vi validere at datoen er i riktig format
    if (inputProps.value && !regEx.test(inputProps.value as string)) {
      setErrorMessage(getAppText("validering.ugyldig-dato"));
    }
  }

  function saveFaktum(value: string | null) {
    if (!value || value === "") {
      clearErrorMessage();
      saveFaktumToQuiz(faktum, null);
      return;
    }

    validateDate(new Date(value));

    if (isValid) {
      saveFaktumToQuiz(faktum, value);
    }
  }

  const datePickerDescription = faktumTexts?.description ? (
    <PortableText value={faktumTexts.description} />
  ) : undefined;

  const fromDate = allowFutureDateWithWarning.includes(faktum.beskrivendeId)
    ? SOKNAD_DATO_DATEPICKER_MIN_DATE
    : DATEPICKER_MIN_DATE;

  const toDate = allowFutureDateWithWarning.includes(faktum.beskrivendeId)
    ? SOKNAD_DATO_DATEPICKER_MAX_DATE
    : DATEPICKER_MAX_DATE;

  return (
    <div ref={ref} id={faktum.id} tabIndex={-1} aria-invalid={unansweredFaktumId === faktum.id}>
      <DatePicker
        {...datepickerProps}
        dropdownCaption
        fromDate={fromDate}
        toDate={toDate}
        strategy="fixed"
      >
        <DatePicker.Input
          {...inputProps}
          label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
          placeholder={getAppText("datovelger.dato-format")}
          description={datePickerDescription}
          error={errorMessage}
          disabled={isLocked}
          autoComplete="off"
          onBlur={() => validateOnBlur()}
        />
      </DatePicker>
      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
      {currentAnswer && hasWarning && <FaktumDatoWarning selectedDate={currentAnswer} />}
    </div>
  );
}
