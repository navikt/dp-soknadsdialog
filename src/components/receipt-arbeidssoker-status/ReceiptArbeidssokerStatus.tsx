import React from "react";
import { Alert, BodyShort } from "@navikt/ds-react";
import { IArbeidssokerStatus } from "../../api/arbeidssoker-api";
import { useSanity } from "../../context/sanity-context";
import styles from "./ReceiptArbeidssokerStatus.module.css";

interface IProps {
  status: IArbeidssokerStatus;
}

export function ArbeidssokerStatus(props: IProps) {
  const { getAppText } = useSanity();

  switch (props.status) {
    case "UNREGISTERED":
      return (
        <Alert variant={"warning"} className={styles.receiptArbeidsokerStatusContainer}>
          {getAppText("kvittering.arbeidssokerstatus.info-tekst.uregistrert")}
        </Alert>
      );

    case "REGISTERED":
      return (
        <BodyShort className={styles.receiptArbeidsokerStatusContainer}>
          {getAppText("kvittering.arbeidssokerstatus.info-tekst.registrert")}
        </BodyShort>
      );

    case "UNKNOWN":
      return (
        <BodyShort className={styles.receiptArbeidsokerStatusContainer}>
          {getAppText("kvittering.arbeidssokerstatus.info-tekst.registrert")}
        </BodyShort>
      );
  }
}
