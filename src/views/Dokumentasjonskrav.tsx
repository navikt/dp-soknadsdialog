import { Heading } from "@navikt/ds-react";
import React from "react";
import { Dokumentkrav } from "../components/dokumentkrav/Dokumentkrav";
import { IDokumentkravListe } from "../types/documentation.types";

interface IProps {
  dokumentasjonskrav: IDokumentkravListe;
}

export function Dokumentasjonskrav(props: IProps) {
  const { dokumentasjonskrav } = props;
  return (
    <>
      <Heading level="2" size="medium">
        Dokumentasjon
      </Heading>
      <p>Antall fakta som må dokumenteres: {dokumentasjonskrav.krav.length}</p>
      {dokumentasjonskrav.krav.map((krav) => {
        return <Dokumentkrav key={krav.id} dokumentkrav={krav} />;
      })}
    </>
  );
}
