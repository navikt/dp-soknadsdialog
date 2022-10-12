import React, { createContext, PropsWithChildren, useState } from "react";

interface IUnansweredFaktum {
  parentFaktumBeskrivendeId?: string;
  beskrivendeId?: string;
  svarIndex?: number;
}

export interface IValidationContext {
  unansweredFaktum?: IUnansweredFaktum;
  setUnansweredFaktum: (unansweredFaktum: IUnansweredFaktum | undefined) => void;
}

export const ValidationContext = createContext<IValidationContext | undefined>(undefined);

function ValidationProvider(props: PropsWithChildren) {
  const [unansweredFaktum, setContextUnansweredFaktum] = useState<IUnansweredFaktum | undefined>(
    undefined
  );

  function setUnansweredFaktum(unansweredFaktum: IUnansweredFaktum | undefined) {
    setContextUnansweredFaktum(unansweredFaktum);
  }

  return (
    <ValidationContext.Provider
      value={{
        unansweredFaktum,
        setUnansweredFaktum,
      }}
    >
      {props.children}
    </ValidationContext.Provider>
  );
}

function useValidation() {
  const context = React.useContext(ValidationContext);
  if (context === undefined) {
    throw new Error("useValidation must be used within a ValidationProvider");
  }
  return context;
}

export { ValidationProvider, useValidation };
