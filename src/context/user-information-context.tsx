import React, { PropsWithChildren, createContext, useState } from "react";
import type { IArbeidsforhold } from "../components/arbeidsforhold/ArbeidsforholdList";

const UserInformationContext = createContext<{ arbeidsforhold: IArbeidsforhold[] } | null>(null);

interface IProps {
  initialState: { arbeidsforhold: IArbeidsforhold[] };
}

function UserInformationProvider(props: PropsWithChildren<IProps>) {
  const [userInformation] = useState(props.initialState || []);

  return (
    <UserInformationContext.Provider value={userInformation}>
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
