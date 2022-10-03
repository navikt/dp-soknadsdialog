import React from "react";
import { useSanity } from "../../context/sanity-context";
import { Heading, Button } from "@navikt/ds-react";

export function ReceiptDocumentsOther() {
  const { getAppTekst } = useSanity();
  return (
    <div>
      <Heading level={"2"} size="medium">
        {getAppTekst("kvittering.heading.andre.dokumenter")}
      </Heading>
      <Button>Last opp</Button>
    </div>
  );
}
