import { Button, Heading, Tag } from "@navikt/ds-react";
import Link from "next/link";
import { useSanity } from "../../context/sanity-context";
import { useUuid } from "../../hooks/useUuid";
import {
  KVITTERING_MANGLER_DOKUMENT_ANTALL_MANGLER,
  KVITTERING_MANGLER_DOKUMENT_GO_TIL_OPPLASTING_KNAPP,
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
  const { uuid } = useUuid();

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

      <Link href={`/${uuid}/ettersending`} passHref>
        <Button as="a">{getAppText(KVITTERING_MANGLER_DOKUMENT_GO_TIL_OPPLASTING_KNAPP)}</Button>
      </Link>
    </div>
  );
}
