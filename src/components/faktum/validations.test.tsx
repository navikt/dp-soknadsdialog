import { addMonths, addYears, addWeeks } from "date-fns";
import {
  isValidArbeidstimer,
  isValidPermitteringsPercent,
  isOverTwoWeeks,
  isValidTextLength,
  isValidYearRange,
  isValidDateYear,
  isValidNumber,
} from "./validations";

const validTextLengthMock =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ";
const inValidTextLengthMock =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like.";

describe("Input validation", () => {
  test("Validate number", async () => {
    expect(isValidNumber(30)).toBe(true);
    expect(isValidNumber(-20)).toBe(false);
    expect(isValidNumber(parseFloat("30,5"))).toBe(true);
    expect(isValidNumber(-37.5)).toBe(false);
  });

  test("Validate text length", async () => {
    expect(isValidTextLength(validTextLengthMock)).toBe(true);
    expect(isValidTextLength(inValidTextLengthMock)).toBe(false);
  });

  test("Validate arbeidstimer", async () => {
    expect(isValidArbeidstimer(37)).toBe(true);
    expect(isValidArbeidstimer(100)).toBe(false);
  });

  test("Validate permitteringsprosent", async () => {
    expect(isValidPermitteringsPercent(99)).toBe(true);
    expect(isValidPermitteringsPercent(60)).toBe(true);
    expect(isValidPermitteringsPercent(101)).toBe(false);
    expect(isValidPermitteringsPercent(-10)).toBe(false);
  });

  test("Validate soknad date", async () => {
    const today = new Date();
    const nextThreeWeeks = addWeeks(new Date(), 3);
    const lastWeek = addWeeks(new Date(), -1);
    const nextMonth = addMonths(new Date(), 1);
    const lastMonth = addMonths(new Date(), -1);

    expect(isOverTwoWeeks(today)).toBe(false);
    expect(isOverTwoWeeks(nextThreeWeeks)).toBe(true);
    expect(isOverTwoWeeks(lastWeek)).toBe(false);
    expect(isOverTwoWeeks(nextMonth)).toBe(true);
    expect(isOverTwoWeeks(lastMonth)).toBe(false);
  });

  test("Validate date year", async () => {
    expect(isValidDateYear(new Date("1800-01-01"))).toBe(false);
    expect(isValidDateYear(new Date("1900-01-01"))).toBe(true);
    expect(isValidDateYear(new Date("1950-01-01"))).toBe(true);
  });

  test("Validate year range", async () => {
    const today = new Date();
    const about200years = addYears(new Date(), 200);
    const last200years = addYears(new Date(), -200);
    const nextMonth = addMonths(new Date(), 1);
    const lastMonth = addMonths(new Date(), -1);

    expect(isValidYearRange(today)).toBe(true);
    expect(isValidYearRange(about200years)).toBe(false);
    expect(isValidYearRange(last200years)).toBe(false);
    expect(isValidYearRange(nextMonth)).toBe(true);
    expect(isValidYearRange(lastMonth)).toBe(true);
  });
});
