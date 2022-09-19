import React, { useState } from "react";
import classNames from "classnames";
import { format, isValid as isValidDate } from "date-fns";
import styles from "./DatePicker.module.css";
import { TypedObject } from "@portabletext/types";
import { PortableText } from "@portabletext/react";
import { formatISO } from "date-fns";
import { isFutureDate, isValidSoknadDate } from "../faktum/validations";
import { useSanity } from "../../context/sanity-context";

interface IDatePicker {
  id: string;
  label: string;
  description?: TypedObject | TypedObject[];
  errorMessage?: string;
  placeholder?: string;
  onChange: (value: Date) => void;
  disabled?: boolean;
  value?: string;
  min?: string;
  max?: string;
}

export function DatePicker(props: IDatePicker) {
  const { getAppTekst } = useSanity();
  const [date, setDate] = useState<Date | undefined>(
    props.value ? new Date(props.value) : undefined
  );
  const [isValid, setIsValid] = useState(true);
  const [isEmptyDate, setIsEmptyDate] = useState(false);

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
    setIsEmptyDate(false);

    if (!selectedDate) {
      setIsEmptyDate(true);
      setDate(undefined);
    } else if (isValidDate(formattedDate)) {
      setDate(formattedDate);
      validateInput(formattedDate);
      props.onChange(formattedDate);
    } else {
      setIsValid(true);
    }
  }

  function onLeaveDate(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedDate = event.target.value;

    if (!selectedDate) {
      setIsEmptyDate(true);
      setIsValid(false);
    }
  }

  function validateInput(date: Date) {
    switch (props.id) {
      case "faktum.dagpenger-soknadsdato": {
        const validSoknadDate = isValidSoknadDate(date);
        setIsValid(validSoknadDate);
        break;
      }
      case "faktum.arbeidsforhold.antall-timer-dette-arbeidsforhold": {
        const validArbeidsforholdTimer = !isFutureDate(date);
        setIsValid(validArbeidsforholdTimer);
        break;
      }
      case "faktum.arbeidsforhold.varighet.fra": {
        const validArbeidsforholdFrom = !isFutureDate(date);
        setIsValid(validArbeidsforholdFrom);
        break;
      }
      case "faktum.arbeidsforhold.varighet.til": {
        const validArbeidsforholdTo = !isFutureDate(date);
        setIsValid(validArbeidsforholdTo);
        break;
      }
      default: {
        setIsValid(true);
        break;
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
          [styles.datePickerInputError]: !isValid,
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
      {!isValid && (
        <div
          className={classNames(
            styles.datePickerInputErrorLabel,
            "navds-error-message navds-label"
          )}
        >
          {isEmptyDate ? getAppTekst("validering.ugyldig-dato") : props.errorMessage}
        </div>
      )}
    </div>
  );
}
