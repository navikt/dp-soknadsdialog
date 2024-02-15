import React from "react";
import { UserInformationContext } from "../context/user-information-context";

interface IProps {
  children: React.ReactElement;
}

export function MockUserInformationProvider({ children }: IProps) {
  return (
    <UserInformationContext.Provider
      value={{
        arbeidsforhold: [],
      }}
    >
      {children}
    </UserInformationContext.Provider>
  );
}
