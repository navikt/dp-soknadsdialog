import { Detail, Heading, Tag } from "@navikt/ds-react";
import { PortableText } from "@portabletext/react";
import { useSanity } from "../../context/sanity-context";
import { ISoknadStatus, ISoknadStatuser } from "../../pages/api/soknad/[uuid]/status";
import styles from "./ReceiptSoknadStatus.module.css";
import {
  KVITTERING_SOKNAD_STATUS_DESCRIPTION_FERDIG_BEHANDLET,
  KVITTERING_SOKNAD_STATUS_DESCRIPTION_MANGLER_DOKUMENTER,
  KVITTERING_SOKNAD_STATUS_DESCRIPTION_UNDER_BEHANDLING,
  KVITTERING_SOKNAD_STATUS_SUBTITLE_INNSENDT_DATO,
  KVITTERING_SOKNAD_STATUS_TAG__FERDIG_BEHANDLET,
  KVITTERING_SOKNAD_STATUS_TAG__MANGLER_DOKUMENTER,
  KVITTERING_SOKNAD_STATUS_TAG__UNDER_BEHANDLING,
  KVITTERING_SOKNAD_STATUS_TITLE_FERDIG,
  KVITTERING_SOKNAD_STATUS_TITLE_MOTTATT,
} from "../../text-constants";
import { format } from "date-fns";

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
          <Tag variant={getTagColor(props.status)}>
            {getAppText(getStatusTagTextKey(props.status))}
          </Tag>
        )}
      </div>

      {props.innsendt && (
        <Detail>
          {`${getAppText(KVITTERING_SOKNAD_STATUS_SUBTITLE_INNSENDT_DATO)} ${format(
            new Date(props.innsendt),
            "dd.MM.yyyy - HH:mm"
          )}`}
        </Detail>
      )}

      {receiptDescriptionText?.body && <PortableText value={receiptDescriptionText.body} />}
    </>
  );
}

function getStatusDescriptionTextKey(status: ISoknadStatuser) {
  switch (status) {
    case "UnderBehandling":
      return KVITTERING_SOKNAD_STATUS_DESCRIPTION_UNDER_BEHANDLING;
    case "FerdigBehandlet":
      return KVITTERING_SOKNAD_STATUS_DESCRIPTION_FERDIG_BEHANDLET;
    case "ManglerDokumenter":
      return KVITTERING_SOKNAD_STATUS_DESCRIPTION_MANGLER_DOKUMENTER;
    default:
      return "getStatusDescriptionTextKey() no-text-key";
  }
}

function getStatusTagTextKey(status: ISoknadStatuser) {
  switch (status) {
    case "UnderBehandling":
      return KVITTERING_SOKNAD_STATUS_TAG__UNDER_BEHANDLING;
    case "FerdigBehandlet":
      return KVITTERING_SOKNAD_STATUS_TAG__FERDIG_BEHANDLET;
    case "ManglerDokumenter":
      return KVITTERING_SOKNAD_STATUS_TAG__MANGLER_DOKUMENTER;
    default:
      return "getStatusTagTextKey() no-text-key";
  }
}

function getTagColor(status: ISoknadStatuser) {
  switch (status) {
    case "UnderBehandling":
      return "info";
    case "FerdigBehandlet":
      return "success";
    case "ManglerDokumenter":
      return "warning";
    default:
      return "info";
  }
}
