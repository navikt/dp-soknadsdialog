import { MAX_TEXT_LENGTH, MAX_YEAR_RANGE } from "./../../constants";
import { addWeeks, addYears } from "date-fns";

export function isPositiveNumber(value: number | string): boolean {
  const positiveNumber = /^\d*\.?\d+$/;
  return positiveNumber.test(value.toString());
}

export function isValidTextLength(value: string): boolean {
  const maxTextLength = MAX_TEXT_LENGTH;
  return value.length <= maxTextLength;
}

export function isValidArbeidstimer(value: number): boolean {
  const positiveNumber = isPositiveNumber(value);
  return positiveNumber && value >= 0 && value <= 99;
}

export function isValidPermitteringsPercent(value: number): boolean {
  const positiveNumber = isPositiveNumber(value);
  return positiveNumber && value >= 0 && value <= MAX_YEAR_RANGE;
}

export function isValidSoknadDate(date: Date): boolean {
  return date >= addYears(new Date(), -MAX_YEAR_RANGE) && date <= addWeeks(new Date(), 2);
}

export function isValidYearRange(date: Date): boolean {
  return (
    date >= addYears(new Date(), -MAX_YEAR_RANGE) && date <= addYears(new Date(), MAX_YEAR_RANGE)
  );
}
