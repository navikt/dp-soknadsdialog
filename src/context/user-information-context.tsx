import { PropsWithChildren, createContext, useContext, useState } from "react";

export interface IArbeidsforhold {
  id: string;
  organisasjonsnavn: string;
  startdato: string;
  sluttdato?: string;
}

interface IUserInformationContext {
  arbeidsforhold: IArbeidsforhold[];
  contextSelectedArbeidsforhold?: IArbeidsforhold;
  setContextSelectedArbeidsforhold: (arbeidsforhold?: IArbeidsforhold) => void;
}
interface IProps {
  arbeidsforhold: IArbeidsforhold[];
  contextSelectedArbeidsforhold?: IArbeidsforhold;
}

export const UserInformationContext = createContext<IUserInformationContext | undefined>(undefined);

function UserInformationProvider(props: PropsWithChildren<IProps>) {
  const [arbeidsforhold] = useState<IArbeidsforhold[]>(props.arbeidsforhold || []);
  const [selectedArbeidsforhold, setSelectedArbeidsforhold] = useState<IArbeidsforhold | undefined>(
    undefined,
  );

  function setContextSelectedArbeidsforhold(arbeidsforhold?: IArbeidsforhold) {
    setSelectedArbeidsforhold(arbeidsforhold);
  }

  return (
    <UserInformationContext.Provider
      value={{
        arbeidsforhold,
        setContextSelectedArbeidsforhold,
        contextSelectedArbeidsforhold: selectedArbeidsforhold,
      }}
    >
      {props.children}
    </UserInformationContext.Provider>
  );
}

function useUserInformation() {
  const context = useContext(UserInformationContext);

  if (!context) {
    throw new Error("useUserInformation must be used within a UserInformationProvider");
  }

  return context;
}

export { UserInformationProvider, useUserInformation };
