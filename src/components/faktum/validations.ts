import { addWeeks } from "date-fns";

export function isPositiveNumber(value: number | string): boolean {
  const positiveNumber = /^\+?(0|[1-9]\d*)$/;
  return positiveNumber.test(value.toString());
}

export function isValidTextLength(value: string): boolean {
  const maxTextLength = 500;
  return value.length <= maxTextLength;
}

export function isValidArbeidstimer(value: number): boolean {
  const positiveNumber = isPositiveNumber(value);
  return positiveNumber && value >= 0 && value <= 99;
}

export function isValidPermitteringsPercent(value: number): boolean {
  const positiveNumber = isPositiveNumber(value);
  return positiveNumber && value >= 0 && value <= 100;
}

export function isValidSoknadDate(date: Date): boolean {
  return date <= addWeeks(new Date(), 2);
}
