import { ARBEIDSFORHOLD_NAVN_BEDRIFT_FAKTUM_ID } from "./constants";
import { QuizFaktum } from "./types/quiz.types";

export function findEmployerName(fakta: QuizFaktum[]) {
  return fakta.find((faktum) => faktum.beskrivendeId === ARBEIDSFORHOLD_NAVN_BEDRIFT_FAKTUM_ID)
    ?.svar as string;
}
