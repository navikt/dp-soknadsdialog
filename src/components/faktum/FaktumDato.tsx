import { Alert, BodyShort, Label, UNSAFE_DatePicker, UNSAFE_useDatepicker } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { formatISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { DATEPICKER_MAX_DATE, DATEPICKER_MIN_DATE } from "../../constants";
import { useQuiz } from "../../context/quiz-context";
import { useSanity } from "../../context/sanity-context";
import { useValidation } from "../../context/validation-context";
import { useValidateFaktumDato } from "../../hooks/faktum/useValidateFaktumDato";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";
import { useFirstRender } from "../../hooks/useFirstRender";
import { useScrollIntoView } from "../../hooks/useScrollIntoView";
import { useSetFocus } from "../../hooks/useSetFocus";
import { IQuizDatoFaktum } from "../../types/quiz.types";
import { FormattedDate } from "../FormattedDate";
import { HelpText } from "../HelpText";
import { IFaktum } from "./Faktum";
import styles from "./Faktum.module.css";

export function FaktumDato(props: IFaktum<IQuizDatoFaktum>) {
  const { faktum, onChange } = props;
  const isFirstRender = useFirstRender();
  const faktumDatoRef = useRef(null);
  const { saveFaktumToQuiz } = useQuiz();
  const { getFaktumTextById, getAppText } = useSanity();
  const { setDatePickerIsOpen, unansweredFaktumId } = useValidation();
  const { setFocus } = useSetFocus();
  const { scrollIntoView } = useScrollIntoView();
  const { errorMessage, isValid, getHasWarning } = useValidateFaktumDato(faktum);
  const faktumTexts = getFaktumTextById(props.faktum.beskrivendeId);
  const [currentAnswer, setCurrentAnswer] = useState(props.faktum.svar);
  const [debouncedDate, setDebouncedDate] = useState(currentAnswer);
  const debouncedChange = useDebouncedCallback(setDebouncedDate, 500);

  useEffect(() => {
    if (!isFirstRender) {
      onChange ? onChange(faktum, debouncedDate) : saveFaktum(debouncedDate);
    }
  }, [debouncedDate]);

  useEffect(() => {
    if (!faktum.svar && !isFirstRender) {
      setCurrentAnswer("");
    }
  }, [faktum.svar]);

  useEffect(() => {
    if (unansweredFaktumId === faktum.id) {
      scrollIntoView(faktumDatoRef);
      setFocus(faktumDatoRef);
    }
  }, [unansweredFaktumId]);

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

  if (props.faktum.readOnly || props.readonly) {
    return (
      <>
        <Label>{faktumTexts ? faktumTexts.text : faktum.beskrivendeId}</Label>
        <BodyShort>{currentAnswer ? <FormattedDate date={currentAnswer} /> : ""}</BodyShort>
      </>
    );
  }

  const datePickerDescription = faktumTexts?.description ? (
    <PortableText value={faktumTexts.description} />
  ) : undefined;

  // Wasning mesage is specific for faktum "faktum.dagpenger-soknadsdato"
  const hasWarning = currentAnswer && getHasWarning(new Date(currentAnswer));

  return (
    <div ref={faktumDatoRef} tabIndex={-1} aria-invalid={unansweredFaktumId === faktum.id}>
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
        />
      </UNSAFE_DatePicker>
      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
      {hasWarning && (
        <Alert
          data-testid="faktum.soknadsdato-varsel"
          variant="warning"
          className={styles.faktumDatoWarningSpacing}
        >
          {getAppText("validering.dato-faktum.soknadsdato-varsel")}
        </Alert>
      )}
    </div>
  );
}
