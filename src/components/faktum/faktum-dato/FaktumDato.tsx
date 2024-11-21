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
import { useFirstRender } from "../../../hooks/useFirstRender";
import {
  futureDateAllowedWithWarningList,
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
  const faktumTexts = getFaktumTextById(props.faktum.beskrivendeId);

  const [selectedDate, setSelectedDate] = useState<string>(props.faktum.svar ?? "");
  const [shouldSave, setShouldSave] = useState(false);

  const { errorMessage, validateAndIsValid, applicationDateIsOverTwoWeeks, setErrorMessage } =
    useValidateFaktumDato(faktum);

  // Used to reset current answer to what the backend state is if there is a mismatch
  useEffect(() => {
    if (!isFirstRender && faktum.svar !== selectedDate) {
      setSelectedDate(faktum.svar ?? "");
    }
  }, [faktum]);

  // Save selected date to quiz if it is valid or empty
  useEffect(() => {
    if (shouldSave) {
      saveFaktum(selectedDate);
    }
  }, [shouldSave, selectedDate]);

  const { datepickerProps, inputProps } = useDatepicker({
    defaultSelected: props.faktum.svar ? new Date(props.faktum.svar) : undefined,
    onDateChange: (value?: Date) => {
      const selectedDate = value ? formatISO(value, { representation: "date" }) : "";
      setSelectedDate(selectedDate);
    },
    onValidate: (value) => {
      if (value.isEmpty) {
        setShouldSave(true);
        setSelectedDate("");
        setErrorMessage("");
        return;
      }

      if (value.isInvalid) {
        setShouldSave(false);
        setSelectedDate("");
        setErrorMessage(getAppText("validering.ugyldig-dato"));
        return;
      }

      if (value.isValidDate) {
        setShouldSave(true);
      }
    },
  });

  // Trigger save when user leaves input field when typing a date manually
  function onBlur() {
    // if the date is empty or invalid, save null to quiz
    if (selectedDate === "" || !validateAndIsValid(new Date(selectedDate))) {
      saveFaktumToQuiz(faktum, null);
    }
  }

  function saveFaktum(value: string) {
    if (value === "") {
      saveFaktumToQuiz(faktum, null);
      return;
    }

    const isValidDate = validateAndIsValid(new Date(value));
    if (isValidDate) {
      saveFaktumToQuiz(faktum, isValidDate ? value : null);
    }
  }

  const datePickerDescription = faktumTexts?.description ? (
    <PortableText value={faktumTexts.description} />
  ) : undefined;

  const warning = applicationDateIsOverTwoWeeks(new Date(selectedDate));

  const fromDate = futureDateAllowedWithWarningList.includes(faktum.beskrivendeId)
    ? SOKNAD_DATO_DATEPICKER_MIN_DATE
    : DATEPICKER_MIN_DATE;

  const toDate = futureDateAllowedWithWarningList.includes(faktum.beskrivendeId)
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
          onBlur={onBlur}
        />
      </DatePicker>
      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
      {warning && <FaktumDatoWarning selectedDate={selectedDate} />}
    </div>
  );
}
