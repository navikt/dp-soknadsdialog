import React from "react";
import { useState, forwardRef, ForwardRefRenderFunction, InputHTMLAttributes } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import dateFnsFormat from "date-fns/format";
import { isValid } from "date-fns";
import { TextField } from "@navikt/ds-react";
import { Calender } from "@navikt/ds-icons";
import { dayPickerProps } from "./datepicker-utils";

import styles from "./DatePicker.module.css";
import "react-day-picker/lib/style.css";

interface DatePickerProps {
  label: string;
  placeholder?: string;
  onChange: (value: Date) => void;
  disabled?: boolean;
  value?: string;
}

export function DatePicker(props: DatePickerProps) {
  const [date, setDate] = useState(props.value);
  const DAYPICKER_FORMAT = "yyyy-MM-dd";
  const DEFAULT_PLACEHOLDER = "yyyy-MM-dd";

  const onDayChange = (value: Date) => {
    let formatted;
    if (isValid(value)) {
      formatted = dateFnsFormat(value, DAYPICKER_FORMAT);
      setDate(formatted);
      props.onChange(value);
    }
  };

  type CustomDateInputType = ForwardRefRenderFunction<
    HTMLInputElement,
    InputHTMLAttributes<HTMLInputElement>
  >;

  const CustomDateInput: CustomDateInputType = (
    { placeholder, value, onBlur, onChange, onClick, onFocus, onKeyDown, onKeyUp },
    ref
  ) => {
    return (
      <div className={styles.customInput}>
        <TextField
          disabled={props.disabled}
          ref={ref}
          label={props.label}
          onBlur={onBlur}
          onChange={onChange}
          onClick={onClick}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          placeholder={placeholder}
          value={value?.toString()}
        />
        {<Calender className={styles.customInputIcon} />}
      </div>
    );
  };

  const CustomInputFwdRef = forwardRef(CustomDateInput);

  return (
    <>
      <DayPickerInput
        style={{ lineHeight: 1 }}
        component={CustomInputFwdRef}
        placeholder={props.placeholder ? props.placeholder : DEFAULT_PLACEHOLDER}
        format={DAYPICKER_FORMAT}
        dayPickerProps={dayPickerProps}
        onDayChange={onDayChange}
        value={date}
      />
    </>
  );
}
