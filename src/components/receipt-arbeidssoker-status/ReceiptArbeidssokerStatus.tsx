import React from "react";
import { IArbeidssokerStatus } from "../../pages/api/arbeidssoker";
import { Alert, BodyShort } from "@navikt/ds-react";
import styles from "./ReceiptArbeidssokerStatus.module.css";
import { useSanity } from "../../context/sanity-context";

export function ArbeidssokerStatus(props: IArbeidssokerStatus) {
  const { getAppTekst } = useSanity();

  if (!props.isRegistered) {
    return (
      <Alert variant={"warning"} className={styles.receiptArbeidsokerStatusContainer}>
        {getAppTekst("kvittering.arbeidsokerstatus.warning-tekst")}
      </Alert>
    );
  }
  return (
    <BodyShort className={styles.receiptArbeidsokerStatusContainer}>
      {getAppTekst("kvittering.arbeidsokerstatus.info-tekst")}
    </BodyShort>
  );
}
