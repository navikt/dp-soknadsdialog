import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, isValid } from "date-fns";
import { TextField } from "@navikt/ds-react";
import dateFnsFormat from "date-fns/format";

interface DatePickerProps {
  label: string;
  placeholder?: string;
  onChange: (value: Date) => void;
  disabled?: boolean;
  value?: string;
}

export function DatePicker(props: DatePickerProps) {
  const [date, setDate] = useState<Date | undefined>(
    props.value ? new Date(props.value) : undefined
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isValidDate, setIsValidDate] = useState(true);

  function onDateChange(value: Date) {
    console.log("Just value:", value);
    if (isValid(value)) {
      setIsValidDate(true);
      console.log("Valid:", value);
      setDate(value);
      props.onChange(value);
    } else {
      setIsValidDate(false);
    }
  }

  return (
    <>
      <div>
        <TextField
          label={props.label}
          type={"text"}
          placeholder={format(new Date(), "y-MM-dd")}
          defaultValue={date ? dateFnsFormat(date, "dd.MM.yyyy") : ""}
          onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
          onChange={(event) => onDateChange(new Date(event.currentTarget.value))}
          error={!isValidDate ? "Ugyldig dato" : null}
        />

        {isDatePickerOpen && (
          <DayPicker mode="single" defaultMonth={date} selected={date} onSelect={onDateChange} />
        )}
      </div>
    </>
  );
}
