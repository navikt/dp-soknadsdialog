import { Heading } from "@navikt/ds-react";
import React from "react";
import { DocumentItem } from "../components/documentation/DocumentItem";
import { useDocumentation } from "../context/documentation-context";

export function Documentation() {
  const { documents } = useDocumentation();

  return (
    <>
      <Heading level="2" size="medium">
        Dokumentasjon
      </Heading>
      <p>Antall fakta som må dokumenteres: {documents.list.length}</p>
      {documents.list.map((item) => {
        return <DocumentItem key={item.id} documentItem={item} />;
      })}
    </>
  );
}
