import { UNSAFE_DatePicker, UNSAFE_useDatepicker } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { formatISO } from "date-fns";
import { Ref, forwardRef, useEffect, useState } from "react";
import { DATEPICKER_MAX_DATE, DATEPICKER_MIN_DATE } from "../../../constants";
import { useQuiz } from "../../../context/quiz-context";
import { useSanity } from "../../../context/sanity-context";
import { useValidation } from "../../../context/validation-context";
import { useValidateFaktumDato } from "../../../hooks/faktum/useValidateFaktumDato";
import { useDebouncedCallback } from "../../../hooks/useDebouncedCallback";
import { useFirstRender } from "../../../hooks/useFirstRender";
import { IQuizDatoFaktum } from "../../../types/quiz.types";
import { HelpText } from "../../HelpText";
import { IFaktum } from "../Faktum";
import styles from "../Faktum.module.css";
import { FaktumDatoWarning } from "./FaktumDatoWarning";

export const FaktumDato = forwardRef(FaktumDatoComponent);

function FaktumDatoComponent(
  props: IFaktum<IQuizDatoFaktum>,
  ref: Ref<HTMLDivElement> | undefined
) {
  const { faktum, onChange } = props;
  const isFirstRender = useFirstRender();
  const { saveFaktumToQuiz, isLocked } = useQuiz();
  const { getFaktumTextById, getAppText } = useSanity();
  const { setDatePickerIsOpen, unansweredFaktumId } = useValidation();
  const { errorMessage, isValid, getHasWarning } = useValidateFaktumDato(faktum);
  const faktumTexts = getFaktumTextById(faktum.beskrivendeId);
  const [currentAnswer, setCurrentAnswer] = useState(faktum.svar);
  const [debouncedDate, setDebouncedDate] = useState(currentAnswer);
  const debouncedChange = useDebouncedCallback(setDebouncedDate, 500);

  useEffect(() => {
    if (!isFirstRender) {
      onChange ? onChange(faktum, debouncedDate) : saveFaktum(debouncedDate);
    }
  }, [debouncedDate]);

  useEffect(() => {
    if (!isFirstRender && faktum.svar !== currentAnswer) {
      setCurrentAnswer(faktum.svar ? faktum.svar : "");
    }
  }, [faktum]);

  const { datepickerProps, inputProps } = UNSAFE_useDatepicker({
    defaultSelected: currentAnswer ? new Date(currentAnswer) : undefined,
    onDateChange: (value?: Date) => {
      const debounceValue = value ? formatISO(value, { representation: "date" }) : null;
      setCurrentAnswer(debounceValue);
      debouncedChange(debounceValue);
    },
  });

  // Use to prevent Escape key press to close both datepicker and modal simultaneously
  // This is a temporaty fix for ds-react version 2.0.9
  // Design system team are working on a better solution
  useEffect(() => {
    setDatePickerIsOpen(!!datepickerProps.open);
  }, [datepickerProps]);

  function saveFaktum(value: string | undefined | null) {
    if (!value) {
      saveFaktumToQuiz(faktum, null);
    }

    if (value && !isValid(new Date(value))) {
      saveFaktumToQuiz(faktum, null);
    }

    if (value && isValid(new Date(value))) {
      saveFaktumToQuiz(faktum, value);
    }
  }

  const datePickerDescription = faktumTexts?.description ? (
    <PortableText value={faktumTexts.description} />
  ) : undefined;

  const hasWarning = currentAnswer && getHasWarning(new Date(currentAnswer));

  return (
    <div ref={ref} tabIndex={-1} aria-invalid={unansweredFaktumId === faktum.id}>
      <UNSAFE_DatePicker
        {...datepickerProps}
        dropdownCaption
        fromDate={DATEPICKER_MIN_DATE}
        toDate={DATEPICKER_MAX_DATE}
        strategy="fixed"
      >
        <UNSAFE_DatePicker.Input
          {...inputProps}
          label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
          placeholder={getAppText("datovelger.dato-format")}
          description={datePickerDescription}
          error={errorMessage}
          disabled={isLocked}
        />
      </UNSAFE_DatePicker>
      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
      {hasWarning && <FaktumDatoWarning selectedDate={currentAnswer} />}
    </div>
  );
}
