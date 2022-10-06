import React from "react";
import { useSanity } from "../../context/sanity-context";
import { BodyShort, Heading, Button } from "@navikt/ds-react";
import styles from "./ReceiptDocumentsOther.module.css";

export function ReceiptDocumentsOther() {
  const { getAppTekst } = useSanity();
  return (
    <div>
      <Heading level={"2"} size="small">
        {getAppTekst("kvittering.heading.andre.dokumenter")}
      </Heading>
      <BodyShort>
        Hvis du har noe annet du ønsker å legge ved, kan du laste opp dette her. Dette er helt
        valgfritt.
      </BodyShort>
      <Button className={styles.uploadButton}>Last opp</Button>
    </div>
  );
}
