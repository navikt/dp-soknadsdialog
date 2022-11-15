import { Heading, Tag } from "@navikt/ds-react";
import { useSanity } from "../../context/sanity-context";
import {
  KVITTERING_MANGLER_DOKUMENT_ANTALL_MANGLER,
  KVITTERING_MANGLER_DOKUMENT_HEADING,
} from "../../text-constants";
import { IDokumentkrav } from "../../types/documentation.types";
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
          {getAppText(KVITTERING_MANGLER_DOKUMENT_HEADING)}
        </Heading>
        <Tag variant="warning">
          {props.documents?.length} {getAppText(KVITTERING_MANGLER_DOKUMENT_ANTALL_MANGLER)}
        </Tag>
      </div>

      {props.documents.map((dokumentkrav) => (
        <ReceiptDocumentsMissingItem key={dokumentkrav.beskrivendeId} {...dokumentkrav} />
      ))}
    </div>
  );
}
