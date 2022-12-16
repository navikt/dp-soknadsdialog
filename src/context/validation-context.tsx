import React, { createContext, PropsWithChildren, useState } from "react";

export interface IValidationContext {
  unansweredFaktumId?: string;
  setUnansweredFaktumId: (unansweredFaktumId: string | undefined) => void;
  datePickerIsOpen: boolean;
  setDatePickerIsOpen: (isOpen: boolean) => void;
}

export const ValidationContext = createContext<IValidationContext | undefined>(undefined);

function ValidationProvider(props: PropsWithChildren) {
  const [unansweredFaktumId, setContextUnansweredFaktumId] = useState<string | undefined>(
    undefined
  );

  // Tempory fix for ds-react 2.0.9 to prevent closing clossing modal and datepicker simultaneously
  const [datePickerIsOpen, setContextDatePickerIsOpen] = useState(false);

  function setUnansweredFaktumId(unansweredFaktumId: string | undefined) {
    setContextUnansweredFaktumId(unansweredFaktumId);
  }

  function setDatePickerIsOpen(isOpen: boolean) {
    setContextDatePickerIsOpen(isOpen);
  }

  return (
    <ValidationContext.Provider
      value={{
        unansweredFaktumId,
        setUnansweredFaktumId,
        datePickerIsOpen,
        setDatePickerIsOpen,
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
