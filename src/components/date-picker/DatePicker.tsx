import React, { useState } from "react";
import classNames from "classnames";
import { format, isValid } from "date-fns";
import styles from "./DatePicker.module.css";
import { TypedObject } from "@portabletext/types";
import { PortableText } from "@portabletext/react";
import { formatISO } from "date-fns";
import { isFutureDate, isValidSoknadDate } from "../../utils/validations";

interface IDatePicker {
  id: string;
  label: string;
  description?: TypedObject | TypedObject[];
  placeholder?: string;
  onChange: (value: Date) => void;
  disabled?: boolean;
  value?: string;
  min?: string;
  max?: string;
}

export function DatePicker(props: IDatePicker) {
  const [date, setDate] = useState<Date | undefined>(
    props.value ? new Date(props.value) : undefined
  );
  const [isValidDate, setIsValidDate] = useState(true);

  const DATEPICKER_MIN_DATE = calculateIsoDateFromNow(-100);
  const DATEPICKER_MAX_DATE = calculateIsoDateFromNow(100);

  const min = props.min || DATEPICKER_MIN_DATE;
  const max = props.max || DATEPICKER_MAX_DATE;

  function calculateIsoDateFromNow(years: number) {
    const newDate = new Date().setFullYear(new Date().getFullYear() + years);

    return formatISO(newDate, { representation: "date" });
  }

  function onChangeDate(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedDate = event.target.value;
    const formattedDate = new Date(selectedDate);

    if (!selectedDate) {
      setDate(undefined);
    } else if (isValid(formattedDate)) {
      validateInput();
      setDate(formattedDate);
      props.onChange(formattedDate);
    } else {
      setIsValidDate(false);
    }
  }

  function onLeaveDate(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedDate = event.target.value;

    if (!selectedDate) {
      setIsValidDate(false);
    }
  }

  function validateInput() {
    if (date) {
      switch (props.id) {
        case "faktum.dagpenger-soknadsdato": {
          const validSoknadDate = isValidSoknadDate(date);
          setIsValidDate(validSoknadDate);
          break;
        }
        case "faktum.arbeidsforhold.antall-timer-dette-arbeidsforhold": {
          const validArbeidsforholdTimer = !isFutureDate(date);
          setIsValidDate(validArbeidsforholdTimer);
          break;
        }
        case "faktum.arbeidsforhold.varighet.fra": {
          const validArbeidsforholdFrom = !isFutureDate(date);
          setIsValidDate(validArbeidsforholdFrom);
          break;
        }
        case "faktum.arbeidsforhold.varighet.til": {
          const validArbeidsforholdTo = !isFutureDate(date);
          setIsValidDate(validArbeidsforholdTo);
          break;
        }
        default: {
          setIsValidDate(true);
          break;
        }
      }
    }
  }

  return (
    <div className={styles.datePicker}>
      {props.label && (
        <label className="navds-form-field__label navds-label" htmlFor={props.id}>
          {props.label}
        </label>
      )}
      {props.description && (
        <div className="navds-form-field__description navds-body-short navds-body-short--small">
          {props.description ? <PortableText value={props.description} /> : undefined}
        </div>
      )}
      <input
        className={classNames(styles.datePickerInput, {
          [styles.datePickerInputError]: !isValidDate,
        })}
        type="date"
        id={props.id}
        name={props.id}
        value={date ? format(date, "yyyy-MM-dd") : ""}
        pattern="\d{4}-\d{2}-\d{2}"
        onChange={(e) => onChangeDate(e)}
        onBlur={(e) => onLeaveDate(e)}
        disabled={props.disabled}
        min={min}
        max={max}
      />
      {!isValidDate && (
        <div
          className={classNames(
            styles.datePickerInputErrorLabel,
            "navds-error-message navds-label"
          )}
        >
          Ugyldig dato
        </div>
      )}
    </div>
  );
}
