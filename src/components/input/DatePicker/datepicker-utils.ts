import { DayPickerProps } from "react-day-picker";
import { DateUtils } from "react-day-picker";
import dateFnsParse from "date-fns/parse";
import dateFnsFormat from "date-fns/format";
import { nb } from "date-fns/locale";

const modifiers = {
  sundays: { daysOfWeek: [0] },
};

const modifiersStyles = {
  sundays: { color: "#C30000" },
  selected: { color: "#FFFFFF" },
};
console.log("lol");

export const dayPickerProps: DayPickerProps = {
  showOutsideDays: true,
  firstDayOfWeek: 1,
  modifiers,
  modifiersStyles,
  locale: nb,
};

export function parseDate(str: string, format: string, locale: string) {
  const parsed = dateFnsParse(str, format, new Date(), { locale });
  if (DateUtils.isDate(parsed)) {
    return parsed;
  }
  return undefined;
}

export function formatDate(date: Date, format: string, locale: string) {
  return dateFnsFormat(date, format, { locale });
}
