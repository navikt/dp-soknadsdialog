import { Heading, Tag } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { useSanity } from "../../context/sanity-context";
import { ISoknadStatus, ISoknadStatuser } from "../../pages/api/soknad/[uuid]/status";
import styles from "./ReceiptSoknadStatus.module.css";
import {
  KVITTERING_SOKNAD_STATUS_DESCRIPTION_FERDIG_BEHANDLET,
  KVITTERING_SOKNAD_STATUS_DESCRIPTION_MANGLER_DOKUMENTER,
  KVITTERING_SOKNAD_STATUS_DESCRIPTION_PAABEGYNT,
  KVITTERING_SOKNAD_STATUS_DESCRIPTION_UKJENT,
  KVITTERING_SOKNAD_STATUS_DESCRIPTION_UNDER_BEHANDLING,
  KVITTERING_SOKNAD_STATUS_TAG__FERDIG_BEHANDLET,
  KVITTERING_SOKNAD_STATUS_TAG__MANGLER_DOKUMENTER,
  KVITTERING_SOKNAD_STATUS_TAG__PAABEGYNT,
  KVITTERING_SOKNAD_STATUS_TAG__UKJENT,
  KVITTERING_SOKNAD_STATUS_TAG__UNDER_BEHANDLING,
  KVITTERING_SOKNAD_STATUS_TITLE_FERDIG,
  KVITTERING_SOKNAD_STATUS_TITLE_MOTTATT,
} from "../../text-constants";

export function ReceiptSoknadStatus(props: ISoknadStatus) {
  const { getAppText, getInfosideText } = useSanity();
  const receiptDescriptionText = getInfosideText(getStatusDescriptionTextKey(props.status));

  return (
    <>
      <div className={styles.receiptSoknadTilstandHeader}>
        <Heading level="2" size="medium">
          {props.status === "FerdigBehandlet"
            ? getAppText(KVITTERING_SOKNAD_STATUS_TITLE_FERDIG)
            : getAppText(KVITTERING_SOKNAD_STATUS_TITLE_MOTTATT)}
        </Heading>

        {props.status !== "Ukjent" && (
          <Tag variant="success">{getAppText(getStatusTagTextKey(props.status))}</Tag>
        )}
      </div>

      {receiptDescriptionText?.body && <PortableText value={receiptDescriptionText.body} />}
    </>
  );
}

function getStatusDescriptionTextKey(status: ISoknadStatuser) {
  switch (status) {
    case "Paabegynt":
      return KVITTERING_SOKNAD_STATUS_DESCRIPTION_PAABEGYNT;
    case "UnderBehandling":
      return KVITTERING_SOKNAD_STATUS_DESCRIPTION_UNDER_BEHANDLING;
    case "FerdigBehandlet":
      return KVITTERING_SOKNAD_STATUS_DESCRIPTION_FERDIG_BEHANDLET;
    case "ManglerDokumenter":
      return KVITTERING_SOKNAD_STATUS_DESCRIPTION_MANGLER_DOKUMENTER;
    case "Ukjent":
      return KVITTERING_SOKNAD_STATUS_DESCRIPTION_UKJENT;
  }
}

function getStatusTagTextKey(status: ISoknadStatuser) {
  switch (status) {
    case "Paabegynt":
      return KVITTERING_SOKNAD_STATUS_TAG__PAABEGYNT;
    case "UnderBehandling":
      return KVITTERING_SOKNAD_STATUS_TAG__UNDER_BEHANDLING;
    case "FerdigBehandlet":
      return KVITTERING_SOKNAD_STATUS_TAG__FERDIG_BEHANDLET;
    case "ManglerDokumenter":
      return KVITTERING_SOKNAD_STATUS_TAG__MANGLER_DOKUMENTER;
    case "Ukjent":
      return KVITTERING_SOKNAD_STATUS_TAG__UKJENT;
  }
}
