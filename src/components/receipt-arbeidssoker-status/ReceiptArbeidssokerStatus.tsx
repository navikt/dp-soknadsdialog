import { Alert, BodyShort } from "@navikt/ds-react";
import Link from "next/link";
import { useSanity } from "../../context/sanity-context";
import styles from "./ReceiptArbeidssokerStatus.module.css";
import { IArbeidssokerStatus } from "../../pages/api/common/arbeidssoker-api";

interface IProps {
  status: IArbeidssokerStatus;
}

export function ReceiptArbeidssokerStatus(props: IProps) {
  const { getAppText } = useSanity();

  switch (props.status) {
    case "UNREGISTERED":
      return (
        <div>
          <Alert variant={"warning"} className={styles.receiptArbeidsokerStatusContainer}>
            {getAppText("kvittering.arbeidssokerstatus.info-tekst.uregistrert")}
          </Alert>
          <Link href="https://arbeidssokerregistrering.nav.no/">
            {getAppText("arbeidssoker.registrer-som-arbeidssoker-knapp")}
          </Link>
        </div>
      );

    case "REGISTERED":
      return (
        <BodyShort className={styles.receiptArbeidsokerStatusContainer}>
          {getAppText("kvittering.arbeidssokerstatus.info-tekst.registrert")}
        </BodyShort>
      );

    case "ERROR":
      return (
        <div>
          <Alert variant={"warning"} className={styles.receiptArbeidsokerStatusContainer}>
            {getAppText("arbeidssoker.arbeidssoker-status.varsel-tekst")}
          </Alert>
          <Link href="https://arbeidssokerregistrering.nav.no/">
            {getAppText("arbeidssoker.registrer-som-arbeidssoker-knapp")}
          </Link>
        </div>
      );
  }
}
