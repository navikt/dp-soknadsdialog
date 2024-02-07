import React, { PropsWithChildren, createContext, useState } from "react";
import type { IArbeidsforhold } from "../components/arbeidsforhold/ArbeidsforholdList";

interface IUserInformationContext {
  arbeidsforhold: IArbeidsforhold[];
  setArbeidstid: (arbeidstid: string | null) => void;
  arbeidstid: string | null;
}
interface IProps {
  arbeidsforhold: IArbeidsforhold[];
}

export const UserInformationContext = createContext<IUserInformationContext | undefined>(undefined);

function UserInformationProvider(props: PropsWithChildren<IProps>) {
  const [arbeidsforhold] = useState<IArbeidsforhold[]>(props.arbeidsforhold || []);
  const [arbeidstid, setArbeidstid] = useState<string | null>(null);

  return (
    <UserInformationContext.Provider value={{ arbeidsforhold, arbeidstid, setArbeidstid }}>
      {props.children}
    </UserInformationContext.Provider>
  );
}

function useUserInformation() {
  const context = React.useContext(UserInformationContext);

  if (!context) {
    throw new Error("useUserInformation must be used within a UserInformationProvider");
  }

  return context;
}

export { UserInformationProvider, useUserInformation };
