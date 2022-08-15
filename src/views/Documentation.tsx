import { Heading } from "@navikt/ds-react";
import React from "react";
import { DocumentItem } from "../components/documentation/DocumentItem";
import { IDokumentkravListe } from "../types/documentation.types";

interface IProps {
  documents: IDokumentkravListe;
}

export function Documentation(props: IProps) {
  return (
    <>
      <Heading level="2" size="medium">
        Dokumentasjon
      </Heading>
      <p>Antall fakta som må dokumenteres: {props.documents.list.length}</p>
      {props.documents.list.map((item) => {
        return <DocumentItem key={item.id} documentItem={item} />;
      })}
    </>
  );
}
