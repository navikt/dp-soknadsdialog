import { ARBEIDSFORHOLD_NAVN_BEDRIFT_FAKTUM_ID } from "../constants";
import { IQuizLandFaktum, QuizFaktum } from "../types/quiz.types";

export function findEmployerName(fakta: QuizFaktum[]) {
  return fakta.find((faktum) => faktum.beskrivendeId === ARBEIDSFORHOLD_NAVN_BEDRIFT_FAKTUM_ID)
    ?.svar as string;
}

export function getLandGruppeId(faktum: IQuizLandFaktum, code: string) {
  const outsideLandGruppeId = `${faktum.beskrivendeId}.gruppe.utenfor-landgruppe`;

  // Fjern tredjeland-landgruppen fra listen når vi er i "hvilket land bor du i"-spørsmål
  // Hvis man svarer et land fra den gruppen, ønsker vi å vise "utenfor-landgruppe"-teksten
  const tredjelandGruppeId = "faktum.hvilket-land-bor-du-i.gruppe.tredjeland"
  const landgrupperUtenTredjeland = faktum.grupper.filter((group) => group.gruppeId !== tredjelandGruppeId);

  const currentLandGruppeId = landgrupperUtenTredjeland.find((group) => group.land.includes(code))?.gruppeId;

  return currentLandGruppeId || outsideLandGruppeId;
}
