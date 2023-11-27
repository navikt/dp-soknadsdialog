import { ARBEIDSFORHOLD_NAVN_BEDRIFT_FAKTUM_ID } from "../constants";
import { IQuizLandFaktum, QuizFaktum } from "../types/quiz.types";

export function findEmployerName(fakta: QuizFaktum[]) {
  return fakta.find((faktum) => faktum.beskrivendeId === ARBEIDSFORHOLD_NAVN_BEDRIFT_FAKTUM_ID)
    ?.svar as string;
}

export function getLandGruppeId(faktum: IQuizLandFaktum, code: string) {
  const outsideLandGruppeId = `${faktum.beskrivendeId}.gruppe.utenfor-landgruppe`;
  const currentLandGruppeId = faktum.grupper.find((group) => group.land.includes(code))?.gruppeId;
  return currentLandGruppeId || outsideLandGruppeId;
}
