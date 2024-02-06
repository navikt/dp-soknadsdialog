import React, { PropsWithChildren, createContext, useEffect, useState } from "react";
import type { IArbeidsforhold } from "../components/arbeidsforhold/ArbeidsforholdList";
import { subMonths } from "date-fns";
import { IQuizState } from "../types/quiz.types";

interface IUserInformationContext {
  filteredArbeidsforhold: IArbeidsforhold[];
  setArbeidstid: (arbeidstid: string | null) => void;
}
interface IProps {
  unfilteredArbeidsforhold: IArbeidsforhold[];
}

export const UserInformationContext = createContext<IUserInformationContext | undefined>(undefined);

function filterArbeidsforhold(
  arbeidsforhold: IArbeidsforhold[],
  periode: number,
): IArbeidsforhold[] {
  const today = new Date();
  const cutoffDate = subMonths(today, periode);
  return arbeidsforhold.filter(
    (forhold) => !forhold.sluttdato || new Date(forhold.sluttdato) > cutoffDate,
  );
}

function sortArbeidsforhold(forhold1: IArbeidsforhold, forhold2: IArbeidsforhold): number {
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

function findArbeidstid(soknad: IQuizState): string {
  return (
    (soknad.seksjoner
      ?.find((seksjon) => seksjon.beskrivendeId === "din-situasjon")
      ?.fakta.find(({ beskrivendeId }) => beskrivendeId === "faktum.type-arbeidstid")
      ?.svar as string) ?? ""
  );
}

function getPeriode(arbeidstid?: string | null): number {
  if (!arbeidstid) return 6;

  const twelveMonths = ["varierende", "kombinasjon"];
  const type = arbeidstid?.split(".").pop();

  if (!type) return 6;

  return twelveMonths.includes(type) ? 12 : 6;
}

function UserInformationProvider(props: PropsWithChildren<IProps>) {
  const [filteredArbeidsforhold, setFilteredArbeidsforhold] = useState<IArbeidsforhold[]>([]);
  const [arbeidstid, setArbeidstid] = useState<string | null>(null);

  const periode = getPeriode(arbeidstid);

  const filtered = filterArbeidsforhold(props.unfilteredArbeidsforhold, periode).sort(
    sortArbeidsforhold,
  );

  useEffect(() => {
    setFilteredArbeidsforhold(filtered);
  }, []);

  return (
    <UserInformationContext.Provider value={{ filteredArbeidsforhold, setArbeidstid }}>
      {props.children}
    </UserInformationContext.Provider>
  );
}

function useUserInformation() {
  const context = React.useContext(UserInformationContext);

  if (!context) {
    throw new Error("useUserInformation must be used within a UserInformationProvider");
  }

  // const periode = getPeriode(arbeidstid);

  // context.arbeidsforhold =

  return context;
}

export {
  UserInformationProvider,
  filterArbeidsforhold,
  findArbeidstid,
  getPeriode,
  sortArbeidsforhold,
  useUserInformation,
};
