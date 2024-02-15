import { subMonths } from "date-fns";
import { IArbeidsforhold } from "../context/user-information-context";
import { IQuizPeriodeFaktumAnswerType, IQuizState } from "../types/quiz.types";

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

export function sortArbeidsforhold(arbeidsforhold: IArbeidsforhold[]): IArbeidsforhold[] {
  return [...arbeidsforhold].sort((forhold1, forhold2) => {
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
  });
}

export function findArbeidstid(soknad: IQuizState): string | null {
  return (
    (soknad?.seksjoner
      ?.find((seksjon) => seksjon.beskrivendeId === "din-situasjon")
      ?.fakta.find(({ beskrivendeId }) => beskrivendeId === "faktum.type-arbeidstid")
      ?.svar as string) ?? null
  );
}

export function getPeriodeLength(arbeidstid: string | null): number {
  const defaultPeriodeLength = 6;

  if (!arbeidstid) return defaultPeriodeLength;

  const twelveMonths = ["varierende", "kombinasjon"];
  const type = arbeidstid?.split(".").pop();

  if (!type) return defaultPeriodeLength;

  return twelveMonths.includes(type) ? 12 : defaultPeriodeLength;
}

export function getPeriodeObject(arbeidsforhold?: IArbeidsforhold): IQuizPeriodeFaktumAnswerType {
  const periode: IQuizPeriodeFaktumAnswerType = {
    fom: "",
  };

  if (arbeidsforhold) {
    periode.fom = arbeidsforhold.startdato;
  }

  if (arbeidsforhold?.sluttdato) {
    periode.tom = arbeidsforhold.sluttdato;
  }

  return periode;
}

export function objectsNotEqual<T>(object1: T, object2: T) {
  return JSON.stringify(object1) !== JSON.stringify(object2);
}
