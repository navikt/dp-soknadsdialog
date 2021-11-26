import { useState } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { DateUtils } from "react-day-picker";
import dateFnsFormat from "date-fns/format";
import dateFnsParse from "date-fns/parse";
import { isValid } from "date-fns";

import "react-day-picker/lib/style.css";

function dayPickerParser(str, format, locale) {
  const parsed = dateFnsParse(str, format, new Date(), { locale });
  if (DateUtils.isDate(parsed)) {
    return parsed;
  }
  return undefined;
}

function dayPickerFormatter(date, format, locale) {
  return dateFnsFormat(date, format, { locale });
}

export function DatePicker({ onChange }) {
  const [date, setDate] = useState(null);
  const DAYPICKER_FORMAT = "dd.MM.yyyy";
  const dayPickerProps = {
    showOutsideDays: true,
  };

  const onDayChange = (value) => {
    let formatted;
    if (isValid(value)) {
      formatted = dateFnsFormat(value, DAYPICKER_FORMAT);
      setDate(formatted);
      onChange(formatted);
    }
  };
  return (
    <DayPickerInput
      formatDate={dayPickerFormatter}
      placeholder="dd.mm.yyyy"
      format={DAYPICKER_FORMAT}
      parseDate={dayPickerParser}
      dayPickerProps={dayPickerProps}
      onDayChange={onDayChange}
      value={date}
    />
  );
}
