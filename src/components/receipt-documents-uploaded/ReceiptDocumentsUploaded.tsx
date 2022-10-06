import React from "react";
import { IDokumentkrav } from "../../types/documentation.types";
import { Heading, Tag, BodyShort, Button } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import styles from "./ReceiptDocumentsUploaded.module.css";

interface IProps {
  documents: IDokumentkrav[];
}

export function ReceiptDocumentsUploaded(props: IProps) {
  function handleOpenFile(urn: string) {
    // eslint-disable-next-line no-console
    console.log(urn);
  }

  const { getAppTekst } = useSanity();
  return (
    <div>
      <div className={styles.headingContainer}>
        <Heading level={"2"} size="medium">
          {getAppTekst("kvittering.heading.mottatt.dokumenter")}
        </Heading>
        <Tag variant="success">
          {props.documents?.length} {getAppTekst("kvittering.text.antall-sendt")}
        </Tag>
      </div>

      {props.documents.map((dokumentkrav) => (
        <div key={dokumentkrav.beskrivendeId} className={styles.documentItem}>
          <div>
            <BodyShort>
              <b>{dokumentkrav.beskrivendeId}</b>
            </BodyShort>
            <BodyShort>
              {`${getAppTekst("kvittering.heading.text.sendt-av")} ${
                dokumentkrav.filer[0]?.tidspunkt || "30.09.2022"
              }`}
            </BodyShort>
          </div>
          <Button variant="tertiary" onClick={() => handleOpenFile(dokumentkrav.bundle as string)}>
            Åpne
          </Button>
        </div>
      ))}
    </div>
  );
}
