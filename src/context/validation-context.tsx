import React, { createContext, PropsWithChildren, useState } from "react";

export interface IValidationContext {
  unansweredFaktumId?: string | undefined;
  setUnansweredFaktumId: (unansweredFaktumId: string | undefined) => void;
}

export const ValidationContext = createContext<IValidationContext | undefined>(undefined);

function ValidationProvider(props: PropsWithChildren) {
  const [unansweredFaktumId, setContextUnansweredFaktumId] = useState<string | undefined>(
    undefined
  );

  function setUnansweredFaktumId(unansweredFaktumId: string | undefined) {
    setContextUnansweredFaktumId(unansweredFaktumId);
  }

  return (
    <ValidationContext.Provider
      value={{
        unansweredFaktumId,
        setUnansweredFaktumId,
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
