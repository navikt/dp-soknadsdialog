import React from "react";
import { IDokumentkrav } from "../../types/documentation.types";
import { Heading } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";

interface IProps {
  documents: IDokumentkrav[];
}

export function ReceiptDocumentsNotSending(props: IProps) {
  const { getAppTekst } = useSanity();
  return (
    <div>
      <Heading level={"2"} size="medium">
        {getAppTekst("kvittering.heading.sender.ikke")}
      </Heading>

      {props.documents.map((dokumentkrav) => (
        <div key={dokumentkrav.beskrivendeId}>{dokumentkrav.beskrivendeId}</div>
      ))}
    </div>
  );
}
