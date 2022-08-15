import { Heading } from "@navikt/ds-react";
import React from "react";
import { Dokumentkrav } from "../components/dokumentkrav/Dokumentkrav";
import { IDokumentkravListe } from "../types/documentation.types";

interface IProps {
  dokumentasjonskrav: IDokumentkravListe;
}

export function Dokumentasjonskrav(props: IProps) {
  return (
    <>
      <Heading level="2" size="medium">
        Dokumentasjon
      </Heading>
      <p>Antall fakta som må dokumenteres: {props.dokumentasjonskrav.list.length}</p>
      {props.dokumentasjonskrav.list.map((item) => {
        return <Dokumentkrav key={item.id} dokumentkrav={item} />;
      })}
    </>
  );
}
