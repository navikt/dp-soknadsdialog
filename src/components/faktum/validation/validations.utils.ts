import { addWeeks } from "date-fns";
import { DATEPICKER_FROM_DATE, MAX_TEXT_LENGTH } from "../../../constants";
import { IQuizGeneratorFaktum, QuizFaktum } from "../../../types/quiz.types";
import { DATEPICKER_TO_DATE } from "./../../../constants";

export function isValidTextLength(value: string): boolean {
  const maxTextLength = MAX_TEXT_LENGTH;
  return value.length <= maxTextLength;
}

export function isNumber(value: string): boolean {
  const regExPattern = /^[0-9,.-]*$/;
  return regExPattern.test(value);
}

export function isValidArbeidstimer(value: number): boolean {
  return value >= 0 && value <= 99;
}

export function isValidPermitteringsPercent(value: number): boolean {
  return value >= 0 && value <= 100;
}

export function isOverTwoWeeks(date: Date): boolean {
  return date >= addWeeks(new Date(), 2);
}

export function isWithinValidDateRange(date: Date): boolean {
  return date >= DATEPICKER_FROM_DATE && date <= DATEPICKER_TO_DATE;
}

export function getUnansweredGeneratorFaktumId(generatorFaktum: IQuizGeneratorFaktum) {
  if (generatorFaktum.svar === undefined) {
    return generatorFaktum.id;
  }

  for (const generatorFaktumSvar of generatorFaktum.svar) {
    const unansweredGeneratorFaktum = generatorFaktumSvar.find(
      (faktum: QuizFaktum) => faktum.svar === undefined,
    );

    if (unansweredGeneratorFaktum) {
      return unansweredGeneratorFaktum.id;
    }
  }
}

export function getUnansweredFaktumId(fakta: (QuizFaktum | IQuizGeneratorFaktum)[]) {
  for (const faktum of fakta) {
    if (faktum.type !== "generator") {
      if (faktum.svar === undefined) {
        return faktum.id;
      }
    } else {
      const unansweredGeneratorFaktumId = getUnansweredGeneratorFaktumId(faktum);
      if (unansweredGeneratorFaktumId) {
        return unansweredGeneratorFaktumId;
      }
    }
  }
}
