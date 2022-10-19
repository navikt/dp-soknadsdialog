import React from "react";
import { IDokumentkrav } from "../../types/documentation.types";
import { useSanity } from "../../context/sanity-context";
import { Heading, Tag } from "@navikt/ds-react";
import styles from "./ReceiptDocumentsMissing.module.css";
import { ReceiptDocumentsMissingItem } from "./ReceiptDocumentsMissingItem";

interface IProps {
  documents: IDokumentkrav[];
}

export function ReceiptDocumentsMissing(props: IProps) {
  const { getAppText } = useSanity();

  return (
    <div>
      <div className={styles.headingContainer}>
        <Heading level={"2"} size="small">
          {getAppText("kvittering.heading.mangler-dokumenter")}
        </Heading>
        <Tag variant="warning">
          {props.documents?.length} {getAppText("kvittering.tekst.antall-mangler")}
        </Tag>
      </div>

      {props.documents.map((dokumentkrav) => (
        <ReceiptDocumentsMissingItem key={dokumentkrav.beskrivendeId} {...dokumentkrav} />
      ))}
    </div>
  );
}
