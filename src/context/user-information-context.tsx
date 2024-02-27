import React, { PropsWithChildren, createContext, useState } from "react";

export interface IArbeidsforhold {
  id: string;
  organisasjonsnavn: string;
  startdato: string;
  sluttdato?: string;
}

export interface IContextSelectedArbeidsforhold {
  organisasjonsnavn: string;
  startdato: string;
  sluttdato?: string;
}

interface IUserInformationContext {
  arbeidsforhold: IArbeidsforhold[];
  contextSelectedArbeidsforhold: IContextSelectedArbeidsforhold | null;
  setContextSelectedArbeidsforhold: (arbeidsforhold: IContextSelectedArbeidsforhold | null) => void;
}
interface IProps {
  arbeidsforhold: IArbeidsforhold[];
}

export const UserInformationContext = createContext<IUserInformationContext | undefined>(undefined);

function UserInformationProvider(props: PropsWithChildren<IProps>) {
  const [arbeidsforhold] = useState<IArbeidsforhold[]>(props.arbeidsforhold || []);
  const [contextSelectedArbeidsforhold, setContextSelectedArbeidsforhold] =
    useState<IContextSelectedArbeidsforhold | null>(null);

  return (
    <UserInformationContext.Provider
      value={{ arbeidsforhold, contextSelectedArbeidsforhold, setContextSelectedArbeidsforhold }}
    >
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
