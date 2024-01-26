import React, { PropsWithChildren, createContext, useState } from "react";
import type { IAareg } from "../components/arbeidsforhold/Aareg";

const UserInformationContext = createContext<IAareg[] | null>(null);

interface IProps {
  initialState: IAareg[];
}

function UserInformationProvider(props: PropsWithChildren<IProps>) {
  const [arbeidsforhold] = useState(props.initialState || []);

  return (
    <UserInformationContext.Provider value={arbeidsforhold}>
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
