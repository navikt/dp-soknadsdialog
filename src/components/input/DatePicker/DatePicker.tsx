import { useState, forwardRef, ForwardRefRenderFunction, InputHTMLAttributes } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import dateFnsFormat from "date-fns/format";
import { isValid } from "date-fns";
import { TextField } from "@navikt/ds-react";
import { Calender } from "@navikt/ds-icons";
import { dayPickerProps, parseDate, formatDate } from "./DatePicker.utils";

import styles from "./DatePicker.module.css";
import "react-day-picker/lib/style.css";

interface DatePickerProps {
  label: string;
  placeholder?: string;
  onChange: (value: Date) => void;
}

export function DatePicker(props: DatePickerProps) {
  const [date, setDate] = useState("");
  const DAYPICKER_FORMAT = "dd.MM.yyyy";
  const DEFAULT_PLACEHOLDER = "dd.mm.yyyy";

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
          ref={ref}
          label={props.label}
          onBlur={onBlur}
          onChange={onChange}
          onClick={onClick}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          placeholder={placeholder}
          value={value}
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
        formatDate={formatDate}
        placeholder={props.placeholder ? props.placeholder : DEFAULT_PLACEHOLDER}
        format={DAYPICKER_FORMAT}
        parseDate={parseDate}
        dayPickerProps={dayPickerProps}
        onDayChange={onDayChange}
        value={date}
      />
    </>
  );
}
