import React from "react";
import { BodyShort } from "@navikt/ds-react";
import { IArbeidssokerStatus } from "../../pages/api/arbeidssoker";
import { useSanity } from "../../context/sanity-context";
import styles from "./ReceiptArbeidssokerStatus.module.css";

interface IProps {
  status: IArbeidssokerStatus;
}

export function ArbeidssokerStatus(props: IProps) {
  const { getAppText } = useSanity();

  return (
    <BodyShort className={styles.receiptArbeidsokerStatusContainer}>
      {getAppText(getArbeidssokerStatusTextKey(props.status))}
    </BodyShort>
  );
}

function getArbeidssokerStatusTextKey(status: IArbeidssokerStatus) {
  switch (status) {
    case "REGISTERED":
      return "kvittering.arbeidsokerstatus.info-tekst.registrert";
    case "UNREGISTERED":
      return "kvittering.arbeidsokerstatus.info-tekst.uregistrert";
    case "UNKNOWN":
      return "kvittering.arbeidsokerstatus.info-tekst.ukjent";
  }
}
