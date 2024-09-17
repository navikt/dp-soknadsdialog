import { PropsWithChildren, createContext, useContext, useState } from "react";

export interface IArbeidsforhold {
  id: string;
  organisasjonsnavn: string;
  startdato: string;
  sluttdato?: string;
}

interface IUserInfoContext {
  arbeidsforhold: IArbeidsforhold[];
  contextSelectedArbeidsforhold?: IArbeidsforhold;
  setContextSelectedArbeidsforhold: (arbeidsforhold?: IArbeidsforhold) => void;
}
interface IProps {
  arbeidsforhold: IArbeidsforhold[];
  contextSelectedArbeidsforhold?: IArbeidsforhold;
}

export const UserInfoContext = createContext<IUserInfoContext | undefined>(undefined);

function UserInfoProvider(props: PropsWithChildren<IProps>) {
  const [arbeidsforhold] = useState<IArbeidsforhold[]>(props.arbeidsforhold || []);
  const [selectedArbeidsforhold, setSelectedArbeidsforhold] = useState<IArbeidsforhold | undefined>(
    undefined,
  );

  function setContextSelectedArbeidsforhold(arbeidsforhold?: IArbeidsforhold) {
    setSelectedArbeidsforhold(arbeidsforhold);
  }

  return (
    <UserInfoContext.Provider
      value={{
        arbeidsforhold,
        setContextSelectedArbeidsforhold,
        contextSelectedArbeidsforhold: selectedArbeidsforhold,
      }}
    >
      {props.children}
    </UserInfoContext.Provider>
  );
}

function useUserInfo() {
  const context = useContext(UserInfoContext);

  if (!context) {
    throw new Error("useUserInfo must be used within a UserInfoProvider");
  }

  return context;
}

export { UserInfoProvider, useUserInfo };
