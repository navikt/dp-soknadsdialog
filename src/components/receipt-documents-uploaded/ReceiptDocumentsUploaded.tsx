import React from "react";
import { IDokumentkrav } from "../../types/documentation.types";
import { Heading, Tag } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import styles from "./ReceiptDocumentsUploaded.module.css";
import { ReceiptDocumentsUploadedItem } from "./ReceiptDocumentsUploadedItem";

interface IProps {
  documents: IDokumentkrav[];
}

export function ReceiptDocumentsUploaded(props: IProps) {
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
        <ReceiptDocumentsUploadedItem
          key={dokumentkrav.beskrivendeId}
          dokumentkrav={dokumentkrav}
        />
      ))}
    </div>
  );
}
