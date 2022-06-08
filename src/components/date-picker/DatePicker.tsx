import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

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

  function onDateChange(value: Date | undefined) {
    if (value) {
      setDate(value);
      props.onChange(value);
    }
  }

  return (
    <>
      <DayPicker mode="single" required={true} selected={date} onSelect={onDateChange} />
    </>
  );
}
