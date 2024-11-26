import { addWeeks, isBefore } from "date-fns";
import { futureDateAllowedWithWarningList } from "../hooks/validation/useValidateFaktumDato";
import {
  DATEPICKER_TO_DATE,
  DATEPICKER_FROM_DATE,
  SOKNAD_DATO_DATEPICKER_TO_DATE,
  SOKNAD_DATO_DATEPICKER_FROM_DATE,
} from "../constants";

export function isDateWithin12Weeks(date: string): boolean {
  const inputDate = new Date(date);
  const today = new Date();
  const endDate = addWeeks(inputDate, 12);

  return isBefore(today, endDate);
}

export function getDatepickerFromDate(beskrivendeId: string) {
  return futureDateAllowedWithWarningList.includes(beskrivendeId)
    ? SOKNAD_DATO_DATEPICKER_FROM_DATE
    : DATEPICKER_FROM_DATE;
}

export function getDatepickerToDate(beskrivendeId: string) {
  return futureDateAllowedWithWarningList.includes(beskrivendeId)
    ? SOKNAD_DATO_DATEPICKER_TO_DATE
    : DATEPICKER_TO_DATE;
}
