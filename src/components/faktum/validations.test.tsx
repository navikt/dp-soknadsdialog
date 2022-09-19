import {
  isPositiveNumber,
  isValidTextLength,
  isValidArbeidstimer,
  isFutureDate,
  isValidPermitteringsPercent,
  isValidSoknadDate,
} from "./validations";
import { addDays, addWeeks, addMonths } from "date-fns";

const validTextLengthMock =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ";
const inValidTextLengthMock =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like.";

describe("Input validation", () => {
  test("Validate positive number", async () => {
    expect(isPositiveNumber(30)).toBe(true);
    expect(isPositiveNumber(-20)).toBe(false);
  });

  test("Validate text length", async () => {
    expect(isValidTextLength(validTextLengthMock)).toBe(true);
    expect(isPositiveNumber(inValidTextLengthMock)).toBe(false);
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

  test("Validate fureture date", async () => {
    const tomorrow = addDays(new Date(), 1);
    const yesterday = addDays(new Date(), -1);
    const lastWeek = addWeeks(new Date(), -1);

    expect(isFutureDate(tomorrow)).toBe(true);
    expect(isFutureDate(yesterday)).toBe(false);
    expect(isFutureDate(lastWeek)).toBe(false);
  });

  test("Validate soknad date", async () => {
    const today = new Date();
    const nextThreeWeeks = addWeeks(new Date(), 3);
    const nextTwoWeeks = addWeeks(new Date(), 2);
    const lastWeek = addWeeks(new Date(), -1);
    const nextMonth = addMonths(new Date(), 1);
    const lastMonth = addMonths(new Date(), -1);

    expect(isValidSoknadDate(today)).toBe(true);
    expect(isValidSoknadDate(nextThreeWeeks)).toBe(false);
    expect(isValidSoknadDate(nextTwoWeeks)).toBe(true);
    expect(isValidSoknadDate(lastWeek)).toBe(true);
    expect(isValidSoknadDate(nextMonth)).toBe(false);
    expect(isValidSoknadDate(lastMonth)).toBe(true);
  });
});

export {};
