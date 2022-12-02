import { Alert } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { TypedObject } from "@portabletext/types";
import classNames from "classnames";
import { format, formatISO, isValid as isValidDate } from "date-fns";
import React, { useEffect, useState } from "react";
import { useSanity } from "../../context/sanity-context";
import styles from "./DatePicker.module.css";

interface IDatePicker {
  id: string;
  label: string;
  description?: TypedObject | TypedObject[];
  warning?: string;
  error?: string;
  placeholder?: string;
  onChange: (value: Date | null) => void;
  disabled?: boolean;
  value?: string | null;
  min?: string;
  max?: string;
  required?: boolean;
}

export function DatePicker(props: IDatePicker) {
  const { getAppText } = useSanity();
  const [date, setDate] = useState<Date | undefined>(
    props.value ? new Date(props.value) : undefined
  );
  const [isEmptyDate, setIsEmptyDate] = useState(false);

  const DATEPICKER_MIN_DATE = calculateIsoDateFromNow(-100);
  const DATEPICKER_MAX_DATE = calculateIsoDateFromNow(100);

  const min = props.min || DATEPICKER_MIN_DATE;
  const max = props.max || DATEPICKER_MAX_DATE;

  useEffect(() => {
    setDate(props.value ? new Date(props.value) : undefined);
  }, [props.value]);

  function calculateIsoDateFromNow(years: number) {
    const newDate = new Date().setFullYear(new Date().getFullYear() + years);

    return formatISO(newDate, { representation: "date" });
  }

  function onChangeDate(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedDate = event.target.value;
    const formattedDate = new Date(selectedDate);
    setIsEmptyDate(false);

    if (selectedDate && isValidDate(formattedDate)) {
      setDate(formattedDate);
      props.onChange(formattedDate);
    }

    if (props.required && !selectedDate) {
      setDate(undefined);
      setIsEmptyDate(true);
    }

    if (!props.required && !selectedDate) {
      setDate(undefined);
      props.onChange(null);
    }
  }

  function onLeaveDate(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedDate = event.target.value;

    setIsEmptyDate(!!props.required && !selectedDate);
    setDate(selectedDate ? new Date(selectedDate) : undefined);
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
          [styles.datePickerInputError]: props.error || isEmptyDate,
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
      {(props.error || isEmptyDate) && (
        <div
          className={classNames(
            styles.datePickerInputErrorLabel,
            "navds-error-message navds-label"
          )}
        >
          {isEmptyDate ? getAppText("validering.ugyldig-dato") : props.error}
        </div>
      )}
      {props.warning && (
        <Alert variant="warning" className={styles.datePickerWarning}>
          {props.warning}
        </Alert>
      )}
    </div>
  );
}
