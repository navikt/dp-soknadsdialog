import { Button, Heading, Tag } from "@navikt/ds-react";
import Link from "next/link";
import { useSanity } from "../../context/sanity-context";
import { useUuid } from "../../hooks/useUuid";
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
          {getAppText("kvittering.heading.mangler-dokumenter")}
        </Heading>
        <Tag variant="warning">
          {props.documents?.length} {getAppText("kvittering.tekst.antall-mangler")}
        </Tag>
      </div>

      {props.documents.map((dokumentkrav) => (
        <ReceiptDocumentsMissingItem key={dokumentkrav.beskrivendeId} {...dokumentkrav} />
      ))}

      <Link href={`/${uuid}/ettersending`} passHref>
        <Button as="a">
          {getAppText("kvittering.mangler-dokumenter.go-til-opplasting-knapp")}
        </Button>
      </Link>
    </div>
  );
}
