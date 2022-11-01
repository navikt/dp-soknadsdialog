import React from "react";
import { useSanity } from "../../context/sanity-context";
import { BodyShort, Heading } from "@navikt/ds-react";
import Link from "next/link";
import {
  KVITTERING_ANDRE_DOKUMENTER_HEADING,
  KVITTERING_ANDRE_DOKUMENTER_lenke,
  KVITTERING_ANDRE_DOKUMENTER_TEKST,
} from "../../text-constants";
import styles from "./ReceiptDocumentsOther.module.css";

export function ReceiptDocumentsOther() {
  const { getAppText } = useSanity();

  return (
    <div className={styles.documentItem}>
      <Heading level={"2"} size="small">
        {getAppText(KVITTERING_ANDRE_DOKUMENTER_HEADING)}
      </Heading>

      <BodyShort>{getAppText(KVITTERING_ANDRE_DOKUMENTER_TEKST)}</BodyShort>

      <Link href="/innsending">{getAppText(KVITTERING_ANDRE_DOKUMENTER_lenke)}</Link>
    </div>
  );
}
