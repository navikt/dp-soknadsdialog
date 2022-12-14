import { addWeeks, isBefore } from "date-fns";

export function isDateWithin12Weeks(date: string): boolean {
  const inputDate = new Date(date);
  const today = new Date();
  const endDate = addWeeks(inputDate, 12);

  return isBefore(today, endDate);
}
