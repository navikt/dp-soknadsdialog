import { DatePicker, useDatepicker } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { formatISO } from "date-fns";
import { Ref, forwardRef, useEffect, useState } from "react";
import { useSoknad } from "../../../context/soknad-context";
import { useSanity } from "../../../context/sanity-context";
import { useValidation } from "../../../context/validation-context";
import { useFirstRender } from "../../../hooks/useFirstRender";
import { useValidateFaktumDato } from "../../../hooks/validation/useValidateFaktumDato";
import { IQuizDatoFaktum } from "../../../types/quiz.types";
import { getDatepickerFromDate, getDatepickerToDate } from "../../../utils/date.utils";
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
  const { saveFaktumToQuiz, isLocked } = useSoknad();
  const { getFaktumTextById, getAppText } = useSanity();
  const { unansweredFaktumId } = useValidation();
  const faktumTexts = getFaktumTextById(props.faktum.beskrivendeId);
  const [selectedDate, setSelectedDate] = useState<string>(faktum.svar ?? "");
  const [shouldSaveWithOnchange, setShouldSaveWithOnchange] = useState(false);
  const { error, validateAndIsValid, shouldShowWarning, setError } = useValidateFaktumDato(faktum);

  // Used to reset current answer to what the backend state is if there is a mismatch
  useEffect(() => {
    if (!isFirstRender || faktum.svar !== selectedDate) {
      setSelectedDate(faktum.svar ?? "");
    }
  }, [faktum.svar]);

  // Save selected date to quiz if it is valid or empty
  useEffect(() => {
    if (shouldSaveWithOnchange) {
      saveFaktum(selectedDate);
    }
  }, [shouldSaveWithOnchange, selectedDate]);

  const { datepickerProps, inputProps } = useDatepicker({
    defaultSelected: faktum.svar ? new Date(faktum.svar) : undefined,
    allowTwoDigitYear: false,
    onDateChange: (value?: Date) => {
      const selectedDate = value ? formatISO(value, { representation: "date" }) : "";
      setSelectedDate(selectedDate);
    },
    onValidate: (value) => {
      if (value.isEmpty) {
        setShouldSaveWithOnchange(false);
        setError("");
        return;
      }

      if (value.isInvalid) {
        setShouldSaveWithOnchange(false);
        setError(getAppText("validering.ugyldig-dato"));
        return;
      }

      if (value.isValidDate && !shouldSaveWithOnchange) {
        setShouldSaveWithOnchange(true);
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
      saveFaktumToQuiz(faktum, value);
    }
  }

  const datePickerDescription = faktumTexts?.description ? (
    <PortableText value={faktumTexts.description} />
  ) : undefined;

  const hasWarning = shouldShowWarning(new Date(selectedDate));

  return (
    <div ref={ref} id={faktum.id} tabIndex={-1} aria-invalid={unansweredFaktumId === faktum.id}>
      <DatePicker
        {...datepickerProps}
        dropdownCaption
        fromDate={getDatepickerFromDate(faktum.beskrivendeId)}
        toDate={getDatepickerToDate(faktum.beskrivendeId)}
        strategy="fixed"
      >
        <DatePicker.Input
          {...inputProps}
          label={faktumTexts?.text ? faktumTexts.text : faktum.beskrivendeId}
          placeholder={getAppText("datovelger.dato-format")}
          description={datePickerDescription}
          error={error}
          disabled={isLocked}
          autoComplete="off"
          onBlur={onBlur}
        />
      </DatePicker>
      {faktumTexts?.helpText && (
        <HelpText className={styles.helpTextSpacing} helpText={faktumTexts.helpText} />
      )}
      {hasWarning && <FaktumDatoWarning selectedDate={selectedDate} />}
    </div>
  );
}
