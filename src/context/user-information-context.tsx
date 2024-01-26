import React, { PropsWithChildren, createContext, useState } from "react";
import type { IAareg } from "../components/arbeidsforhold/Aareg";

const UserInformationContext = createContext<{ arbeidsforhold: IAareg[] } | null>(null);

interface IProps {
  initialState: { arbeidsforhold: IAareg[] };
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
