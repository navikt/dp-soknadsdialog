import React from "react";
import { Alert, BodyShort } from "@navikt/ds-react";
import { IArbeidssokerStatus } from "../../pages/api/arbeidssoker";
import { useSanity } from "../../context/sanity-context";
import styles from "./ReceiptArbeidssokerStatus.module.css";
import {
  KVITTERING_ARBEIDSSOKERSTATUS_INFO_TEXT_REGISTRERT,
  KVITTERING_ARBEIDSSOKERSTATUS_INFO_TEXT_UKJENT,
  KVITTERING_ARBEIDSSOKERSTATUS_INFO_TEXT_UREGISTRERT,
} from "../../text-constants";

interface IProps {
  status: IArbeidssokerStatus;
}

export function ArbeidssokerStatus(props: IProps) {
  const { getAppText } = useSanity();

  switch (props.status) {
    case "UNREGISTERED":
      return (
        <Alert variant={"warning"} className={styles.receiptArbeidsokerStatusContainer}>
          {getAppText(KVITTERING_ARBEIDSSOKERSTATUS_INFO_TEXT_UREGISTRERT)}
        </Alert>
      );

    case "REGISTERED":
      return (
        <BodyShort className={styles.receiptArbeidsokerStatusContainer}>
          {getAppText(KVITTERING_ARBEIDSSOKERSTATUS_INFO_TEXT_REGISTRERT)}
        </BodyShort>
      );

    case "UNKNOWN":
      return (
        <BodyShort className={styles.receiptArbeidsokerStatusContainer}>
          {getAppText(KVITTERING_ARBEIDSSOKERSTATUS_INFO_TEXT_UKJENT)}
        </BodyShort>
      );
  }
}
