import React, { useState } from "react";
import classNames from "classnames";
import { format, isValid } from "date-fns";
import styles from "./DatePicker.module.css";
import { TypedObject } from "@portabletext/types";
import { PortableText } from "@portabletext/react";
import { v4 as uuidv4 } from "uuid";

interface IDatePicker {
  label: string;
  description?: TypedObject | TypedObject[];
  placeholder?: string;
  onChange: (value: Date) => void;
  disabled?: boolean;
  value?: string;
}

export function DatePicker(props: IDatePicker) {
  const [date, setDate] = useState<Date | undefined>(
    props.value ? new Date(props.value) : undefined
  );
  const [isValidDate, setIsValidDate] = useState(true);

  function onChangeDate(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedDate = event.target.value;
    const formattedDate = new Date(selectedDate);

    if (!selectedDate) {
      setDate(undefined);
    } else if (isValid(formattedDate)) {
      setIsValidDate(true);
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

  return (
    <div className={styles.datePicker}>
      {props.label && (
        <label className="navds-form-field__label navds-label" htmlFor={`date-picker-${uuidv4()}`}>
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
        id={`date-picker-${uuidv4()}`}
        name={`date-picker-${uuidv4()}`}
        value={date ? format(date, "yyyy-MM-dd") : ""}
        pattern="\d{4}-\d{2}-\d{2}"
        onChange={(e) => onChangeDate(e)}
        onBlur={(e) => onLeaveDate(e)}
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
