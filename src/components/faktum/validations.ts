import { MAX_TEXT_LENGTH, YEAR_RANGE } from "./../../constants";
import { addWeeks, addYears } from "date-fns";

export function isValidTextLength(value: string): boolean {
  const maxTextLength = MAX_TEXT_LENGTH;
  return value.length <= maxTextLength;
}

export function isValidArbeidstimer(value: number): boolean {
  return value >= 0 && value <= 99;
}

export function isValidPermitteringsPercent(value: number): boolean {
  return value >= 0 && value <= 100;
}

export function isValidDateYear(date: Date): boolean {
  return date >= new Date("1900-01-01");
}

export function isOverTwoWeeks(date: Date): boolean {
  return date >= addWeeks(new Date(), 2);
}

export function isValidYearRange(date: Date): boolean {
  return isValidDateYear(date) && date <= addYears(new Date(), YEAR_RANGE);
}
