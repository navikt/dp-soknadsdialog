import React, { createContext, PropsWithChildren, useState } from "react";
import { Documents } from "../types/documentation.types";

export interface DocumentationContext {
  documents: Documents;
}

export const DocumentationContext = createContext<DocumentationContext | undefined>(undefined);

interface Props {
  initialState: Documents;
}

function DocumentationProvider(props: PropsWithChildren<Props>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [documents, setDocuments] = useState<Documents>(props.initialState);

  return (
    <DocumentationContext.Provider value={{ documents }}>
      {props.children}
    </DocumentationContext.Provider>
  );
}

function useDocumentation() {
  const context = React.useContext(DocumentationContext);
  if (context === undefined) {
    throw new Error("useDocumentation must be used within a DocumentationProvider");
  }
  return context;
}

export { DocumentationProvider, useDocumentation };
