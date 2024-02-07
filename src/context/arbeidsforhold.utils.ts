import { subMonths } from "date-fns";
import { IArbeidsforhold } from "../components/arbeidsforhold/ArbeidsforholdList";
import { IQuizState } from "../types/quiz.types";

export function filterArbeidsforhold(
  arbeidsforhold: IArbeidsforhold[],
  periode: number,
): IArbeidsforhold[] {
  const today = new Date();

  const cutoffDate = subMonths(today, periode);
  return arbeidsforhold.filter(
    (forhold) => !forhold.sluttdato || new Date(forhold.sluttdato) > cutoffDate,
  );
}

export function sortArbeidsforhold(forhold1: IArbeidsforhold, forhold2: IArbeidsforhold): number {
  // Sorteres etter sluttdato (sist avsluttet er først)

  // Både forhold 1 og 2 er pågående, sorter basert på startdato (nyeste dato først)
  if (!forhold1.sluttdato && !forhold2.sluttdato) {
    return forhold1.startdato < forhold2.startdato ? 1 : -1;
  }

  // Forhold 1 er et pågående arbeidsforhold, mens forhold 2 er avsluttet
  if (!forhold1.sluttdato) {
    return -1;
  }

  // Forhold 2 er et pågående arbeidsforhold, mens forhold 1 er avsluttet
  if (!forhold2.sluttdato) {
    return 1;
  }

  // Både forhold 1 og 2 er avsluttede, sorter basert på sluttdato
  return forhold1.sluttdato > forhold2.sluttdato ? 1 : -1;
}

export function findArbeidstid(soknad: IQuizState): string {
  return (
    (soknad.seksjoner
      ?.find((seksjon) => seksjon.beskrivendeId === "din-situasjon")
      ?.fakta.find(({ beskrivendeId }) => beskrivendeId === "faktum.type-arbeidstid")
      ?.svar as string) ?? ""
  );
}

export function getPeriodeLength(arbeidstid?: string | null): number {
  if (!arbeidstid) return 6;

  const twelveMonths = ["varierende", "kombinasjon"];
  const type = arbeidstid?.split(".").pop();

  if (!type) return 6;

  return twelveMonths.includes(type) ? 12 : 6;
}
