import React, { PropsWithChildren, createContext, useState } from "react";

export interface IArbeidsforhold {
  id: string;
  organisasjonsnavn: string;
  startdato: string;
  sluttdato?: string;
}

interface IUserInformationContext {
  arbeidsforhold: IArbeidsforhold[];
}
interface IProps {
  arbeidsforhold: IArbeidsforhold[];
}

export const UserInformationContext = createContext<IUserInformationContext | undefined>(undefined);

function UserInformationProvider(props: PropsWithChildren<IProps>) {
  const [arbeidsforhold] = useState<IArbeidsforhold[]>(props.arbeidsforhold || []);

  return (
    <UserInformationContext.Provider value={{ arbeidsforhold }}>
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
