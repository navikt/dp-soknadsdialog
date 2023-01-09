import React from "react";
import { IDokumentkrav } from "../../types/documentation.types";
import { Heading } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import { ReceiptDocumentsNotSendingItem } from "./ReceiptDocumentsNotSendingItem";
import styles from "./ReceiptDocumentsNotSending.module.css";

interface IProps {
  documents: IDokumentkrav[];
}

export function ReceiptDocumentsNotSending(props: IProps) {
  const { getAppText } = useSanity();
  return (
    <div className="my-12">
      <Heading level={"2"} size="small" className="my-6">
        {getAppText("kvittering.heading.sender-ikke-dokumenter")}
      </Heading>

      <ul className={styles.dokumentkravList}>
        {props.documents.map((dokumentkrav, index) => (
          <ReceiptDocumentsNotSendingItem key={index} dokumentkrav={dokumentkrav} />
        ))}
      </ul>
    </div>
  );
}
